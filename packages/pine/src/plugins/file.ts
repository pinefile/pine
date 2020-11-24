import fs from 'fs';
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
