import fs from 'fs';
import path from 'path';
import Parse from './argv';

/*
function pine() {
  console.log('Pineapple 🍍');
}
*/

class Pine {
  private module: any;
  private _after: any = {};
  private _before: any = {};

  private execute(name: string, argv: any) {
    if (this._before[name]) {
      this._before[name].forEach((name: string) => this.execute(name, argv));
    }

    this.module[name](argv);

    if (this._after[name]) {
      this._after[name].forEach((name: string) => this.execute(name, argv));
    }
  }

  private filePath(argv: any): string {
    if (fs.existsSync(path.resolve('Pinefile'))) {
      return path.resolve('Pinefile');
    }

    if (fs.existsSync(path.resolve('pinefile.js'))) {
      return path.resolve('pinefile.js');
    }

    if (argv.file) {
      return path.resolve(argv.file);
    }

    throw new Error('Pinefile not found');
  }

  before(before: string, after: string) {
    if (!this._before[before]) {
      this._before[before] = [];
    }

    this._before[before].push(after);
  }

  after(after: string, before: string) {
    if (!this._after[after]) {
      this._after[after] = [];
    }

    this._after[after].push(before);
  }

  run() {
    const name = process.argv[2];
    const argv = Parse(process.argv.slice(3));

    if (!name) {
      throw new Error('No task provided');
    }

    this.module = require(this.filePath(argv));

    if (!this.module[name]) {
      throw new Error(`Task ${name} not found`);
    }

    this.execute(name, argv);
  }
}

export default Pine;
