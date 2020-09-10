import path from 'path';
import { PineType } from '../';

export function pkg(this: PineType) {
  return require(path.dirname(this.file()) + '/package.json');
}
