import fs from 'fs';
import path from 'path';
import { parseArgv } from './argv';

const globalAny = global as any;

/*
function pine() {
  console.log('Pineapple 🍍');
}
*/

class Pine {
  private module: any;
  private _after: any = {};
  private _before: any = {};

  private execute(name: string, args: any) {
    if (this._before[name]) {
      this._before[name].forEach((name: string) => this.execute(name, args));
    }

    this.module[name](args);

    if (this._after[name]) {
      this._after[name].forEach((name: string) => this.execute(name, args));
    }
  }

  private filePath(args: any): string {
    if (fs.existsSync(path.resolve('Pinefile'))) {
      return path.resolve('Pinefile');
    }

    if (fs.existsSync(path.resolve('pinefile.js'))) {
      return path.resolve('pinefile.js');
    }

    if (args.file) {
      return path.resolve(args.file);
    }

    throw new Error('Pinefile not found');
  }

  private registerGlobal() {
    globalAny.before = this.before.bind(this);
    globalAny.after = this.after.bind(this);
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

  run(argv: Array<any>) {
    const name = argv[0];
    const args = parseArgv(argv.slice(1));

    this.registerGlobal();

    if (!name) {
      throw new Error('No task provided');
    }

    this.module = require(this.filePath(args));

    if (!this.module[name]) {
      throw new Error(`Task ${name} not found`);
    }

    this.execute(name, args);
  }
}

export default Pine;
