// @ts-ignore
import bach from 'bach';
import pify from 'pify';
import * as logger from './logger';
import { ArgumentsType, PinefileType } from './types';

const resolveTask = (key: string, obj: any, sep = ':'): any => {
  const properties = (Array.isArray(key)
    ? key
    : key.split(sep)) as Array<string>;

  return (
    properties.reduce((prev: Array<any>, cur: string) => {
      return prev[cur] || '';
    }, obj) || obj[key]
  );
};

const getTaskName = (name: string, prefix = '', sep = ':'): string => {
  const names = name.split(sep);
  const lastName = names.pop();
  return names.concat(`${prefix}${lastName}`).join(sep);
};

/**
 * Run tasks series.
 *
 * series('clean', 'build')
 *
 * @return function
 */
export const series = (...tasks: any[]): any => {
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
 * @return function
 */
export const parallel = (...tasks: any[]): any => {
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
 */
const execute = async (
  pinefile: PinefileType,
  name: string,
  args: ArgumentsType
): Promise<void> => {
  let fn = resolveTask(name, pinefile);
  let fnName = name;

  // fine default function in objects.
  if (typeof fn === 'object' && fn.default) {
    fn = fn.default;
    fnName = `${name}:default`;
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
        const postName = getTaskName(fnName, 'post');
        const postFunc = resolveTask(postName, pinefile);
        if (postFunc) {
          await execute(pinefile, postName, args);
        }
      };
      break;
  }

  // execute pre* function.
  const preName = getTaskName(fnName, 'pre');
  const preFunc = resolveTask(preName, pinefile);
  if (preFunc) {
    await execute(pinefile, preName, args);
  }

  const startTime = Date.now();
  if (!logger.isSilent()) {
    logger.info(`Starting ${logger.color.cyan(`'${name}'`)}`);
  }

  return await runner((err: any) => {
    if (err) logger.error(err);

    const time = Date.now() - startTime;
    if (!logger.isSilent()) {
      logger.info(
        `Finished ${logger.color.cyan(
          `'${name}'`
        )} after ${logger.color.magenta(logger.timeInSecs(time))}`
      );
    }
  });
};

/**
 * Run task in pinefile.
 *
 * @param {object} pinefile
 * @param {string} name
 * @param {object} args
 */
export const runTask = async (
  pinefile: PinefileType,
  name: string,
  args: ArgumentsType
) => {
  if (!pinefile) {
    logger.error('Pinefile not found');
    return;
  }

  if (!name) {
    logger.error('No task provided');
    return;
  }

  if (!pinefile[name] && !resolveTask(name, pinefile)) {
    logger.error(`Task ${logger.color.cyan(`'${name}'`)} not found`);
    return;
  }

  return await execute(pinefile, name, args);
};
