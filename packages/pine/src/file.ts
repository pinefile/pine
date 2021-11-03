import fs from 'fs';
import path from 'path';
import { isObject, merge } from '@pinefile/utils';

const PINE_FILE_ORDER = Object.freeze([
  'Pinefile',
  'pinefile.js',
  'pinefile.ts',
]);

const resolveFilePathByTraversing = (
  pathToResolve: string,
  cwd: string,
  file = ''
): string => {
  const customFile = path.resolve(pathToResolve, file);
  if (file && isFile(customFile)) {
    return customFile;
  }

  const pineFile = PINE_FILE_ORDER.map((file) =>
    path.resolve(pathToResolve, file)
  ).find(isFile);
  if (pineFile) {
    return pineFile;
  }

  // system root
  if (pathToResolve === path.dirname(pathToResolve)) {
    throw new Error('Could not find any pinefile');
  }

  // go up a level and try it again
  return resolveFilePathByTraversing(path.dirname(pathToResolve), cwd);
};

export type PineFile = Record<string, any>;
export type PineFileInfo = {
  file: string;
  ext: string;
  dirname: string;
  pineFile: PineFile;
};

/**
 * Parse Pinefile to object with valid key and value.
 *
 * Will convert
 * - 'b:c' keys to object { b: { c: { _: '' } } }
 * - 'b' keys to object { b: { _: '' } }
 *
 * @param {string} pineFile
 * @param {string} sep
 *
 * @returns {object}
 */
export const parsePineFile = (pineFile: PineFile, sep = ':'): PineFile => {
  const obj = isObject(pineFile.default) ? pineFile.default : pineFile;
  return Object.keys(obj).reduce((prev: PineFile, key: string) => {
    if (isObject(obj[key])) {
      prev[key] = parsePineFile(obj[key]);
    } else if (key.indexOf(sep) !== -1) {
      prev = merge(
        prev,
        key
          .split(sep)
          .reverse()
          .reduce((prev2, cur2) => {
            return Object.keys(prev2).length
              ? { [cur2]: prev2 }
              : { [cur2]: { _: obj[key] } };
          }, {})
      );
    } else if (key === '_') {
      prev[key] = obj[key];
    } else {
      prev[key] = { _: obj[key] };
    }
    return prev;
  }, {});
};

export const isFile = (filePath: string): boolean =>
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();

export const findFile = (file = ''): string => {
  if (path.isAbsolute(file) && isFile(file)) {
    return file;
  }

  return resolveFilePathByTraversing(path.resolve('.'), process.cwd(), file);
};

export const loadPineFile = (input: string): PineFileInfo => {
  const file = findFile(input);
  // eslint-disable-next-line
  const body = require(file);

  return {
    file,
    dirname: path.dirname(file),
    ext: path.extname(file),
    pineFile: parsePineFile(body),
  };
};
