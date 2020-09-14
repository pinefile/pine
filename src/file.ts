import fs from 'fs';
import path from 'path';

const PINE_FILE_ORDER = Object.freeze(['Pinefile', 'pinefile.js']);

const isFile = (filePath: string) =>
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory();

export const findFile = (file: string = ''): string => {
  return resolveFilePathByTraversing(path.resolve('.'), process.cwd(), file);
};

const resolveFilePathByTraversing = (
  pathToResolve: string,
  cwd: string,
  file: string = ''
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
    throw new Error('Could not find any pinefile.');
  }

  // go up a level and try it again
  return resolveFilePathByTraversing(path.dirname(pathToResolve), cwd);
};
