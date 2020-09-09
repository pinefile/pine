import fs from 'fs';
import path from 'path';
import { parseArgv } from './argv';

const globalAny = global as any;

function help() {
  console.log(`Usage: pine <task>

Options:
  --help  Show help
  --file  Path to Pinefile`);
}

class Pine {
  /**
   * Pinefile that is used.
   *
   * @var {string}
   */
  private file: string = '';

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
   * Find Pinefile to load.
   *
   * Order:
   * 1. Pinefile
   * 2. pinefile.js
   * 3. --file flag
   *
   * @param {object} args
   */
  private filePath(args: any): string {
    if (this.file) {
      return this.file;
    }

    let file = '';

    if (fs.existsSync(path.resolve('Pinefile'))) {
      file = path.resolve('Pinefile');
    } else if (fs.existsSync(path.resolve('pinefile.js'))) {
      file = path.resolve('pinefile.js');
    } else if (args.file) {
      file = path.resolve(args.file);
    }

    if (file) {
      this.file = file;
      return file;
    }

    throw new Error('Pinefile not found');
  }

  /**
   * Register global functions.
   */
  private registerGlobal() {
    globalAny.before = this.before.bind(this);
    globalAny.after = this.after.bind(this);
    globalAny.load = this.load.bind(this);
  }

  /**
   * Register task that should be runned before a task.
   *
   * Example
   *   before('build', 'compile', 'write')
   */
  before() {
    const before = arguments[0];
    const after = Array.prototype.slice.call(arguments, 1);

    if (!this._before[before]) {
      this._before[before] = [];
    }

    this._before[before] = this._before[before].concat(after);
  }

  /**
   * Register task that should be runned after a task.
   *
   * Example
   *   after('build', 'publish', 'log')
   */
  after() {
    const after = arguments[0];
    const before = Array.prototype.slice.call(arguments, 1);

    if (!this._after[after]) {
      this._after[after] = [];
    }

    this._after[after].push(before);
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
  load(plugins: any) {
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
            file = path.join(path.dirname(this.file), plugins);
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

  run(argv: Array<any>) {
    const name = argv[0];
    const args = parseArgv(argv.slice(1));

    this.registerGlobal();

    try {
      this.module = require(this.filePath(args));
    } catch (err) {}

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
      throw new Error('Pinefile not found');
    }

    if (!name) {
      throw new Error('No task provided');
    }

    if (!this.module[name]) {
      throw new Error(`Task ${name} not found`);
    }

    this.execute(name, args);
  }
}

export default Pine;
