import fs from 'fs';
import { toArray } from '@pinefile/utils';
import rimraf from 'rimraf';
import pify from 'pify';
import { findFile } from '../file';

/**
 * Get package.json content.
 *
 * @return {object}
 */
export const pkg = (): any => {
  return readJSON('package.json');
};

/**
 * Read JSON file.
 *
 * @param  {string} path
 *
 * @return {object}
 */
export const readJSON = (path: string): any => {
  return require(findFile(path));
};

/**
 * Write JSON file.
 *
 * @param {string} path
 * @param {array|object} data
 */
export const writeJSON = (path: string, data: any): void => {
  return fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

/**
 * Remove one or multiple directories or files.
 *
 * @param {string|array} glob Array of strings or string
 * @param {object} opts https://github.com/isaacs/rimraf#options
 *
 * @return {Promise}
 */
export const clear = (
  glob: string | string[],
  opts: any = {}
): Promise<any> => {
  const primraf = pify(rimraf);
  return Promise.all(toArray(glob).map((g) => primraf(g, opts)));
};
