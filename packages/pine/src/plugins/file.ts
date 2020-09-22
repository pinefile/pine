import fs from 'fs';
import path from 'path';
import { isFile, findFile } from '../file';

export function pkg(): any {
  return readJSON('package.json');
}

export function readJSON(file: string): any {
  return require(findFile(file));
}

export function writeJSON(file: string, content: any): boolean {
  if (!file.startsWith('/') && isFile(file)) {
    file = path.join(process.cwd(), file);
  }

  const data = JSON.stringify(content, null, 2);

  fs.writeFileSync(file, data);

  return true;
}
