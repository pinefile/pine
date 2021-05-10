// @ts-ignore
import bach from 'bach';
import { ArgumentsType } from '../args';
import { PineFileType } from '../file';
import { runTask } from '../task';

/**
 * Run tasks that will be executed one after another, in sequential order.
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

  return (pinefile: PineFileType, _: string, args: ArgumentsType) =>
    bach.series(
      ...tasks.map((task) => (cb: any) =>
        runTask(pinefile, task, args).then(cb)
      )
    );
};

/**
 * Run tasks that will be executed simultaneously.
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

  return (pinefile: PineFileType, _: string, args: ArgumentsType) =>
    bach.parallel(
      ...tasks.map((task) => (cb: any) =>
        runTask(pinefile, task, args).then(cb)
      )
    );
};
