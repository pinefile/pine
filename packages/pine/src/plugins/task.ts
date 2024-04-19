// @ts-ignore
import bach from 'bach';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { runTask } from '../task';
import { getPluginConfig } from '../plugin';

/**
 * Run tasks that will be executed one after another, in sequential order.
 *
 * series('clean', 'build')
 *
 * @returns {function|Promise}
 */
export const series = async (...tasks: any[]): any => {
  if (Array.isArray(tasks[0])) {
    return series(...tasks[0]);
  }

  const { pinefile, args } = getPluginConfig();
  const _tasks = tasks.map((task) =>
    typeof task === 'function' ? task : () => runTask(pinefile, task, args),
  );

  return new Promise((resolve, reject) => {
    bach.series(..._tasks)((err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

/**
 * Run tasks that will be executed simultaneously.
 *
 * parallel('clean', 'build')
 *
 * @returns {function|Promise}
 */
export const parallel = (...tasks: any[]): any => {
  if (Array.isArray(tasks[0])) {
    return parallel(...tasks[0]);
  }

  const { pinefile, args } = getPluginConfig();
  const _tasks = tasks.map((task) =>
    typeof task === 'function' ? task : () => runTask(pinefile, task, args),
  );

  return new Promise((resolve, reject) => {
    bach.parallel(..._tasks)((err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
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
        {},
      );
    })
    .reduce((prev, cur) => ({ ...prev, ...cur }), {});

  return tasks;
};
