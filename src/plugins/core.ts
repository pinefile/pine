import fs from 'fs';
import path from 'path';
import { PineType } from '../';

export function pkg(this: PineType): any {
  return require(path.dirname(this.file()) + '/package.json');
}

export function readJSON(this: PineType, file: string): string {
  if (file.startsWith('.')) {
    file = path.dirname(this.file()) + file.slice(1);
  }

  const content = fs.readFileSync(file).toString();

  return JSON.parse(content);
}

export function writeJSON(this: PineType, file: string, content: any): boolean {
  if (file.startsWith('.')) {
    file = path.dirname(this.file()) + file.slice(1);
  }

  const data = JSON.stringify(content, null, 2);

  fs.writeFileSync(file, data);

  return true;
}
