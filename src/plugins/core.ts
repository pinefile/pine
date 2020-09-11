import fs from 'fs';
import path from 'path';
import { PineType } from '../';

export function pkg(this: PineType): any {
  return { version: '1.0.0' };
}

export function readJSON(this: PineType, file: string): string {
  if (!file.startsWith('/')) {
    file = path.join(process.cwd(), file);
  }

  const content = fs.readFileSync(file).toString();

  return JSON.parse(content);
}

export function writeJSON(this: PineType, file: string, content: any): boolean {
  if (!file.startsWith('/')) {
    file = path.join(process.cwd(), file);
  }

  const data = JSON.stringify(content, null, 2);

  fs.writeFileSync(file, data);

  return true;
}
