import fs from 'fs';
import path from 'path';
import { parseArgv } from './argv';
import { flattenArray } from './utils';
import { filePath } from './file';
import * as corePlugins from './plugins/core';

const globalAny = global as any;

function help() {
  console.log(`Usage: pine <task>

Options:
  --help  Show help
  --file  Path to Pinefile`);
}

export type PineType = {
  file(args?: any): string;
};

class Pine implements PineType {
  /**
   * Pinefile that is used.
   *
   * @var {string}
   */
  private _file: string = '';

  /**
   * Loaded JavaScript file.
   *
   * @var {object}
   */
  private module: any;

  /**
   * Registered after tasks.
   *
   * @var {object}
   */
  private _after: any = {};

  /**
   * Registered before tasks.
   *
   * @var {object}
   */
  private _before: any = {};

  /**
   * Execute task.
   *
   * @param {string} name
   * @param {object} args
   */
  private execute(name: string, args: any) {
    if (this._before[name]) {
      this._before[name].forEach((name: string) => this.execute(name, args));
    }

    this.module[name](args);

    if (this._after[name]) {
      this._after[name].forEach((name: string) => this.execute(name, args));
    }
  }

  /**
   * Register global functions.
   */
  private registerGlobal() {
    globalAny.before = this.before.bind(this);
    globalAny.after = this.after.bind(this);
    globalAny.load = this.load.bind(this);
    globalAny.extend = this.load.bind(this);
    this.load(corePlugins);
  }

  /**
   * Find Pinefile to load.
   *
   * Order:
   * 1. Pinefile
   * 2. pinefile.js
   * 3. --file flag
   *
   * @param {object} args
   */
  file(args: any = {}): string {
    if (this._file) {
      return this._file;
    }

    this._file = filePath(args);
    return this._file;
  }

  /**
   * Register task that should be runned before a task.
   *
   * Example
   *   before('build', 'compile', 'write')
   *   before('build', ['compile', 'write'])
   */
  private before() {
    const before = arguments[0];
    const after = Array.prototype.slice.call(arguments, 1);

    if (!this._before[before]) {
      this._before[before] = [];
    }

    this._before[before] = this._before[before].concat(flattenArray(after));
    this._before[before] = [...new Set(this._before[before])];
  }

  /**
   * Register task that should be runned after a task.
   *
   * Example
   *   after('build', 'publish', 'log')
   *   after('build', ['publish', 'log'])
   */
  private after() {
    const after = arguments[0];
    const before = Array.prototype.slice.call(arguments, 1);

    if (!this._after[after]) {
      this._after[after] = [];
    }

    this._after[after] = this._after[after].concat(flattenArray(before));
    this._after[after] = [...new Set(this._after[after])];
  }

  /**
   * Load plugins.
   *
   * Can be a object
   *
   * {
   *  echo: (m) => console.log(m);
   * }
   *
   * Or
   *
   * load(require('file'))
   *
   * Or a string:
   *
   * load('file')
   *
   * Or a array of any values above.
   *
   * @param {array|object|plugins} plugins
   */
  private load(plugins: any) {
    if (Array.isArray(plugins)) {
      plugins.map(this.load);
      return;
    }

    switch (typeof plugins) {
      case 'object':
        for (const key in plugins) {
          globalAny[key] = plugins[key].bind(this);
        }
        break;
      case 'string':
        try {
          let file = '';
          if (fs.existsSync(plugins)) {
            file = plugins;
          } else {
            file = path.join(path.dirname(this.file()), plugins);
          }

          const obj = require(file);
          this.load(obj.default ? obj.default : obj);
        } catch (err) {
          console.error(`Plugin ${plugins} cannot be loaded`);
        }
      default:
        break;
    }
  }

  /**
   * Run tasks or show help.
   *
   * @param {array} argv
   */
  run(argv: Array<any>) {
    const args = parseArgv(argv);
    const name = args._.shift();

    this.registerGlobal();

    try {
      this.module = require(this.file(args));
    } catch (err) {
      if (!args.help) {
        console.error(err);
        return;
      }
    }

    if (args.help) {
      help();

      if (typeof this.module === 'object' && !Array.isArray(this.module)) {
        console.log('\nTasks:');
        for (const key in this.module) {
          console.log(`  ${key}`);
        }
      }

      return;
    }

    if (!this.module) {
      console.error('Pinefile not found');
      return;
    }

    if (!name) {
      console.error('No task provided');
      return;
    }

    if (!this.module[name]) {
      console.error(`Task ${name} not found`);
      return;
    }

    this.execute(name, args);
  }
}

export default Pine;
