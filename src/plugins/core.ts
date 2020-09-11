import fs from 'fs';
import path from 'path';
import { PineType } from '../';

export function pkg(this: PineType): any {
  return require(path.join(process.cwd(), 'package.json'));
}

export function readJSON(this: PineType, file: string): any {
  if (!file.startsWith('/')) {
    file = path.join(process.cwd(), file);
  }

  return require(file);
}

export function writeJSON(this: PineType, file: string, content: any): boolean {
  if (!file.startsWith('/')) {
    file = path.join(process.cwd(), file);
  }

  const data = JSON.stringify(content, null, 2);

  fs.writeFileSync(file, data);

  return true;
}
