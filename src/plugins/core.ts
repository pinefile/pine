import fs from 'fs';
import path from 'path';
import { findFile } from '../file';

export function pkg(): any {
  return require(findFile('package.json'));
}

export function readJSON(file: string): any {
  if (!file.startsWith('/')) {
    file = path.join(process.cwd(), file);
  }

  return require(file);
}

export function writeJSON(file: string, content: any): boolean {
  if (!file.startsWith('/')) {
    file = path.join(process.cwd(), file);
  }

  const data = JSON.stringify(content, null, 2);

  fs.writeFileSync(file, data);

  return true;
}
