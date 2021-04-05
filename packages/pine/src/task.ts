// @ts-ignore
import bach from 'bach';
import pify from 'pify';
import { isObject } from '@pinefile/utils';
import { ArgumentsType } from './args';
import * as logger from './logger';

type PinefileType = {
  [key: string]: any;
};

/**
 * Resolve task function by name.
 *
 * @param {string} key
 * @param {string} obj
 * @param {string} sep
 *
 * @return {function}
 */
export const resolveTask = (key: string, obj: any, sep = ':'): any => {
  if (obj[key]) {
    return obj[key];
  }

  const properties = (Array.isArray(key)
    ? key
    : key.split(sep)) as Array<string>;

  return (
    properties.reduce((prev: Array<any>, cur: string) => {
      return prev[cur] || '';
    }, obj) || obj[key]
  );
};

/**
 * Get task function name with prefix.
 *
 * @param {string} name
 * @param {string} prefix
 * @param {string} sep
 *
 * @return {string}
 */
const getFnName = (name: string, prefix = '', sep = ':'): string => {
  const names = name.split(sep);
  const lastName = names.pop();
  return names.concat(`${prefix}${lastName}`).join(sep);
};

/**
 * Run tasks series.
 *
 * series('clean', 'build')
 *
 * @return {function|Promise}
 */
export const series = (...tasks: any[]): any => {
  if (typeof tasks[0] === 'function') {
    return new Promise((resolve, reject) => {
      bach.series(tasks)((err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  if (Array.isArray(tasks[0])) {
    return series(...tasks[0]);
  }

  return (pinefile: PinefileType, _: string, args: ArgumentsType) =>
    bach.series(
      ...tasks.map((task) => (cb: any) =>
        runTask(pinefile, task, args).then(cb)
      )
    );
};

/**
 * Run tasks parallel.
 *
 * parallel('clean', 'build')
 *
 * @return {function|Promise}
 */
export const parallel = (...tasks: any[]): any => {
  if (typeof tasks[0] === 'function') {
    return new Promise((resolve, reject) => {
      bach.parallel(tasks)((err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  if (Array.isArray(tasks[0])) {
    return parallel(...tasks[0]);
  }

  return (pinefile: PinefileType, _: string, args: ArgumentsType) =>
    bach.parallel(
      ...tasks.map((task) => (cb: any) =>
        runTask(pinefile, task, args).then(cb)
      )
    );
};

/**
 * Execute task in pinefile object.
 *
 * @param {object} pinefile
 * @param {string} name
 * @param {array}  args
 *
 * @return {Promise}
 */
const execute = async (
  pinefile: PinefileType,
  name: string,
  args: ArgumentsType
): Promise<void> => {
  let fn = resolveTask(name, pinefile);
  let fnName = name;

  // use default function in objects.
  if (isObject(fn) && fn.default) {
    fn = fn.default;
    fnName = name !== 'default' ? `${name}:default` : 'default';
  }

  let runner;
  switch (fn.length) {
    case 3:
      // 3: plugin function.
      runner = fn(pinefile, name, args);
      break;
    default:
      // 1: task function.
      runner = async (done: any) => {
        try {
          await pify(fn, { excludeMain: true })(args);
          done();
        } catch (err) {
          done(err);
        }

        // execute post* function.
        const postName = getFnName(fnName, 'post');
        const postFunc = resolveTask(postName, pinefile);
        if (postFunc) {
          await execute(pinefile, postName, args);
        }
      };
      break;
  }

  // execute pre* function.
  const preName = getFnName(fnName, 'pre');
  const preFunc = resolveTask(preName, pinefile);
  if (preFunc) {
    await execute(pinefile, preName, args);
  }

  const startTime = Date.now();
  logger.info(`Starting ${logger.color.cyan(`'${name}'`)}`);

  return await runner((err: any) => {
    if (err) logger.error(err);

    const time = Date.now() - startTime;

    logger.info(
      `Finished ${logger.color.cyan(`'${name}'`)} after ${logger.color.magenta(
        logger.timeInSecs(time)
      )}`
    );
  });
};

/**
 * Run task in pinefile.
 *
 * @param {object} pinefile
 * @param {string} name
 * @param {object} args
 *
 * @return {Promise}
 */
export const runTask = async (
  pinefile: PinefileType,
  name: string,
  args: ArgumentsType
) => {
  if (!resolveTask(name, pinefile)) {
    logger.error(`Task ${logger.color.cyan(`'${name}'`)} not found`);
    return;
  }

  return await execute(pinefile, name, args);
};
