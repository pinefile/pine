// @ts-ignore
import bach from 'bach';
import pify from 'pify';
import * as logger from './log';
import { ArgumentsType, PinefileType } from './types';
import { resolve } from './utils';

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
  let fn = resolve(name, pinefile);
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

          // execute post* function.
          const postName = getTaskName(fnName, 'post');
          const postFunc = resolve(postName, pinefile);
          if (postFunc) {
            await execute(pinefile, postName, args);
          }

          done();
        } catch (err) {
          done(err);
        }
      };
      break;
  }

  // execute pre* function.
  const preName = getTaskName(fnName, 'pre');
  const preFunc = resolve(preName, pinefile);
  if (preFunc) {
    await execute(pinefile, preName, args);
  }

  return await runner((err: any) => {
    if (err) logger.error(err);
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

  if (!pinefile[name] && !resolve(name, pinefile)) {
    logger.error(`Task ${logger.color.cyan(`'${name}'`)} not found`);
    return;
  }

  return await execute(pinefile, name, args);
};
