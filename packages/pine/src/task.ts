import pify from 'pify';
import { isObject } from '@pinefile/utils';
import { Arguments } from './args';
import { color } from './color';
// import { getConfig } from './config';
import { PineFile } from './file';
// import { getRunner } from './runner';
import { internalLog, timeInSecs } from './logger';

/**
 * Determine if input value is a valid task value.
 *
 * @param  {object} val
 *
 * @returns {boolean}
 */
export const validTaskValue = (val: any) => {
  return (
    typeof val === 'function' ||
    (isObject(val) &&
      !!Object.keys(val).length &&
      (typeof val._ === 'undefined' || typeof val._ === 'function'))
  );
};

/**
 * Bind `this` for task functions to parent object.
 *
 * @param {object} obj
 * @param {function} fn
 *
 * @returns {object|boolean}
 */
const bindTask = (obj: PineFile, task: any): PineFile | boolean => {
  if (!validTaskValue(task)) {
    return false;
  }

  if (!isObject(task) || !task._) {
    return { ...task, default: bindTask(task, task.default) };
  }

  return {
    ...task,
    _: task._.bind(
      new Proxy(obj, {
        get(target: PineFile, handler: string) {
          if (
            isObject(target[handler]) &&
            typeof target[handler]._ === 'function'
          ) {
            return target[handler]._;
          }
        },
      })
    ),
  };
};

/**
 * Resolve task function by name.
 *
 * @param {object} obj
 * @param {string} key
 * @param {string} sep
 *
 * @returns {function|object|boolean}
 */
export const resolveTask = (obj: PineFile, key: string, sep = ':'): any => {
  if (!key) {
    return false;
  }

  const properties = (Array.isArray(key) ? key : key.split(sep)) as string[];
  const task = properties.reduce<PineFile>(
    (prev: PineFile, cur: string) =>
      (bindTask(prev, prev[cur]) || {}) as PineFile,
    obj
  );

  if (!validTaskValue(task)) {
    return false;
  }

  if (isObject(task) && task._) {
    return task._;
  }

  if (isObject(task.default)) {
    task.default = task.default._;
  }

  return task;
};

/**
 * Get task function name with prefix.
 *
 * @param {string} name
 * @param {string} prefix
 * @param {string} sep
 *
 * @returns {string}
 */
const getFnName = (name: string, prefix = '', sep = ':'): string => {
  const names = name.split(sep);
  const lastName = names.pop();
  return names.concat(`${prefix}${lastName}`).join(sep);
};

const doneify =
  (fn: any, ...args: any[]) =>
  async (done: any) => {
    try {
      await pify(fn, { excludeMain: true })(args);
      done();
    } catch (err) {
      done(err);
    }
  };

/**
 * Execute task in pinefile object.
 *
 * @param {object} pinefile
 * @param {string} name
 * @param {array}  args
 *
 * @returns {Promise}
 */
const execute = async (
  pinefile: PineFile,
  name: string,
  args: Arguments
): Promise<void> => {
  // const config = getConfig();

  let fn = resolveTask(pinefile, name);
  let fnName = name;
  let fnExists = true;
  let runner = null;

  // eslint-disable-next-line prefer-const
  // let { runner, options } = getRunner(config);
  // if (typeof runner === 'function') {
  //   fn = runner;
  //   fnExists = true;
  // } else if (isObject(runner) && typeof runner.default === 'function') {
  //   fn = runner.default;
  //   fnExists =
  //     typeof runner.taskExists === 'function'
  //       ? runner.taskExists(pinefile, name, args, options)
  //       : typeof fn === 'function';
  // } else if (typeof fn === 'function') {
  //   fnExists = true;
  // }

  // use default function in objects.
  if (isObject(fn) && fn.default) {
    fn = fn.default;
    fnName = name !== 'default' ? `${name}:default` : 'default';
    fnExists = typeof fn === 'function';
  }

  // fail if no task function can be found
  if (!fnExists) {
    internalLog().error(`Task ${color.cyan(`'${name}'`)} not found`);
    return;
  }

  switch (fn.length) {
    // case 4:
    //   // runner function with options
    //   if (isObject(options) && Object.keys(options).length) {
    //     runner = fn(pinefile, name, args, options);
    //   } else {
    //     runner = fn(pinefile, name, args);
    //   }
    //   break;
    case 3:
      // 3: plugin or runner function.
      runner = fn(pinefile, name, args);
      break;
    default:
      // 1: task function.
      runner = async (done: any) => {
        try {
          const fn2 = pify(fn, { excludeMain: true });
          const fn2Type = typeof fn2;
          if (fn2Type === 'function') {
            await fn2(args);
            done();
          } else {
            throw new Error(
              `Expected task function to be a function, got ${
                fn2 === null ? 'null' : fn2Type
              }`
            );
          }
        } catch (err) {
          done(err);
        }
      };
      break;
  }

  // execute pre* function.
  const preName = getFnName(fnName, 'pre');
  const preFunc = resolveTask(pinefile, preName);
  if (preFunc) {
    await execute(pinefile, preName, args);
  }

  const startTime = Date.now();
  internalLog().info(`Starting ${color.cyan(`'${name}'`)}`);

  // await for runner if Promise
  if (runner instanceof Promise) {
    runner = await runner;
  }

  // create a empty runner and throw a error if not a function.
  if (typeof runner !== 'function') {
    const beforeType = runner === null ? 'null' : typeof runner;
    runner = () => {
      throw new Error(
        `Expected return value of runner function to be a function, got ${beforeType}`
      );
    };
  }

  // wrap runner with no arguments
  // with an callback function with
  // done function as a argument.
  if (!runner.length) {
    runner = doneify(runner);
  }

  return await runner(async (err: any) => {
    if (err) internalLog().error(err);

    const time = Date.now() - startTime;

    internalLog().info(
      `Finished ${color.cyan(`'${name}'`)} after ${color.magenta(
        timeInSecs(time)
      )}`
    );

    // execute post* function.
    const postName = getFnName(fnName, 'post');
    const postFunc = resolveTask(pinefile, postName);
    if (postFunc) {
      await execute(pinefile, postName, args);
    }
  });
};

/**
 * Run task in pinefile.
 *
 * @param {object} pinefile
 * @param {string} name
 * @param {object} args
 *
 * @returns {Promise}
 */
export const runTask = async (
  pinefile: PineFile,
  name: string,
  args: Arguments = {}
) => {
  return await execute(pinefile, name, args);
};
