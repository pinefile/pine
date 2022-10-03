// @ts-ignore
import bach from 'bach';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
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

/**
 * Load all tasks from specific Pinefile or directory.
 * Returns empty object if no tasks are found.
 *
 * with file:
 *   tasks('pinefile.js')
 *
 * with directory:
 *   tasks('./tasks')
 *
 * @param {string} filePath file or directory path
 * @param {array} exts array with file extensions without dot
 *
 * @returns {object}
 */
export const tasks = (filePath: string, exts: string[] = ['js', 'ts']) => {
  const resolvedFilePath = path.resolve(filePath);

  if (!fs.existsSync(resolvedFilePath)) {
    return {};
  }

  if (!fs.lstatSync(resolvedFilePath).isDirectory()) {
    return require(resolvedFilePath);
  }

  const pattern = `${filePath}/**/*.{${exts
    .map((x) => x.replace(/\./, ''))
    .join(',')}}`;

  const tasks = glob
    .sync(pattern)
    .map((p: string) => path.resolve(p))
    .map((p: string) => {
      const dirname = p
        .replace(`${resolvedFilePath}/`, '')
        .replace(/\.[^/.]+$/, '')
        .split('/');

      return dirname.reduceRight(
        (prev, cur) =>
          Object.keys(prev).length === 0
            ? { [cur]: require(p) }
            : { [cur]: prev },
        {}
      );
    })
    .reduce((prev, cur) => ({ ...prev, ...cur }), {});

  return tasks;
};
