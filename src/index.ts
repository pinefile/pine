import { parseArgv } from './argv';
import { flattenArray } from './utils';
import { findFile } from './file';
import help from './help';

type PackageType = {
  pine: {
    [key: string]: any;
  };
};

const _before = {};
const _after = {};
let _file = '';
let _module: any = {};

/**
 * Load custom package.json config.
 *
 * @param {object} pkg
 */
const loadPkgConf = (pkg?: PackageType): void => {
  if (!pkg) return;
  const pine =
    typeof pkg.pine === 'object' && !Array.isArray(pkg.pine) ? pkg.pine : {};
  const req = ((Array.isArray(pine.require)
    ? pine.require
    : [pine.require]) as Array<string>).filter((r) => r);
  req.map((r) => require(findFile(r)));
};

/**
 * Register task that should be runned before a task.
 *
 * Example
 *   before('build', 'compile', 'write')
 *   before('build', ['compile', 'write'])
 */
export const before = (...args: any[]): void => {
  const before = args[0];
  const after = Array.prototype.slice.call(args, 1);

  if (!_before[before]) {
    _before[before] = [];
  }

  _before[before] = _before[before].concat(flattenArray(after));
  _before[before] = [...new Set(_before[before])];
};

/**
 * Register task that should be runned after a task.
 *
 * Example
 *   after('build', 'publish', 'log')
 *   after('build', ['publish', 'log'])
 */
export const after = (...args: any[]): void => {
  const after = args[0];
  const before = Array.prototype.slice.call(args, 1);

  if (!_after[after]) {
    _after[after] = [];
  }

  _after[after] = _after[after].concat(flattenArray(before));
  _after[after] = [...new Set(_after[after])];
};

/**
 * Execute task.
 *
 * @param {string} name
 * @param {object} args
 */
const execute = (name: string, args: any): void => {
  if (_before[name]) {
    _before[name].forEach((name: string) => execute(name, args));
  }

  if (_module[name]) {
    _module[name](args);
  }

  if (_after[name]) {
    _after[name].forEach((name: string) => execute(name, args));
  }
};

/**
 * Run tasks or show help.
 *
 * @param {array} argv
 */
export const run = (argv: Array<any>): void => {
  const args = parseArgv(argv);
  const name = args._.shift();

  if (args.help) {
    help();
    return;
  }

  if (!_file) {
    _file = findFile(args.file);
  }

  try {
    // eslint-disable-next-line
    const pkg = require(findFile('package.json'));
    loadPkgConf(pkg);
  } catch (err) {
    console.log(err);
  }

  try {
    // eslint-disable-next-line
    _module = require(_file);
  } catch (err) {
    console.error(err);
    return;
  }

  if (!_module) {
    console.error('Pinefile not found');
    return;
  }

  if (!name) {
    console.error('No task provided');
    return;
  }

  if (!_module[name]) {
    console.error(`Task ${name} not found`);
    return;
  }

  execute(name, args);
};

export * from './plugins/file';
export * from './plugins/shell';
