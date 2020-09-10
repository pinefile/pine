import fs from 'fs';
import path from 'path';
import { parseArgv } from './argv';

export const filePath = (args: any): string => {
  let file = '';

  if (fs.existsSync(path.resolve('Pinefile'))) {
    file = path.resolve('Pinefile');
  } else if (fs.existsSync(path.resolve('pinefile.js'))) {
    file = path.resolve('pinefile.js');
  } else if (args.file) {
    file = path.resolve(args.file);
  }

  if (file) {
    return file;
  }

  throw new Error('Pinefile not found');
};

export const findFile = (): string => {
  const argv = parseArgv(process.argv.slice(2));
  return filePath(argv);
};
