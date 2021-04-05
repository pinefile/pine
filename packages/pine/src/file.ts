import fs from 'fs';
import path from 'path';
import { isObject } from '@pinefile/utils';

const PINE_FILE_ORDER = Object.freeze([
  'Pinefile',
  'pinefile.js',
  'pinefile.ts',
]);

export type PineFileType = {
  [key: string]: any;
};

export const loadPineFile = (file: string): PineFileType => {
  // eslint-disable-next-line
  const pineModule = require(file);
  return isObject(pineModule.default) ? pineModule.default : pineModule;
};

export const isFile = (filePath: string): boolean =>
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();

export const findFile = (file = ''): string => {
  if (path.isAbsolute(file) && isFile(file)) {
    return file;
  }

  return resolveFilePathByTraversing(path.resolve('.'), process.cwd(), file);
};

export const findDirname = (file = ''): string => {
  return path.dirname(findFile(file));
};

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
