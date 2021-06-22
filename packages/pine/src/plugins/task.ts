// @ts-ignore
import bach from 'bach';
import { Arguments } from '../args';
import { PineFile } from '../file';
import { runTask } from '../task';

/**
 * Run tasks that will be executed one after another, in sequential order.
 *
 * series('clean', 'build')
 *
 * @returns {function|Promise}
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

  return (pinefile: PineFile, _: string, args: Arguments) =>
    bach.series(
      ...tasks.map(
        (task) => (cb: any) => runTask(pinefile, task, args).then(cb)
      )
    );
};

/**
 * Run tasks that will be executed simultaneously.
 *
 * parallel('clean', 'build')
 *
 * @returns {function|Promise}
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

  return (pinefile: PineFile, _: string, args: Arguments) =>
    bach.parallel(
      ...tasks.map(
        (task) => (cb: any) => runTask(pinefile, task, args).then(cb)
      )
    );
};
