import fs from 'fs';
import { findFile } from '../file';

export const pkg = (): any => {
  return readJSON('package.json');
};

export const readJSON = (path: string): any => {
  return require(findFile(path));
};

export const writeJSON = (path: string, data: any): void => {
  return fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
