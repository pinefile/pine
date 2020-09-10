import fs from 'fs';
import path from 'path';
import { PineType } from '../';

export function pkg(this: PineType) {
  return require(path.dirname(this.file()) + '/package.json');
}

export function json(this: PineType, file: string) {
  if (file.startsWith('.')) {
    file = path.dirname(this.file()) + file.slice(1);
  }

  const content = fs.readFileSync(file).toString();

  return JSON.parse(content);
}
