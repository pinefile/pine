import fs from 'fs';
import path from 'path';
import { isFile, findFile } from '../file';

export const pkg = (): any => {
  return readJSON('package.json');
};

export const readJSON = (filepath: string): any => {
  return require(findFile(filepath));
};

export const writeJSON = (filepath: string, data: any): void => {
  const data = JSON.stringify(content, null, 2);
  return fs.writeFileSync(filepath, data);
};
