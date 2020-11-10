import 'core-js/stable';
import { findFile } from './file';
import * as logger from './log';
import { ArgumentsType } from './types';
import { resolve } from './utils';

const _before = {};
const _after = {};
let _module: any = {};

/**
 * Register task that should be runned before a task.
 *
 * Example
 *   before('build', 'compile', 'write')
 *   before('build', ['compile', 'write'])
 *   before(['build', 'compile'], 'notify')
 */
export const before = (...args: any): void => {
  const names = args[0];
  const after = Array.prototype.slice.call(args, 1);

  if (!Array.isArray(names) && typeof names !== 'string') {
    throw new Error(
      'First argument of `before` should be array of strings or a string'
    );
  }

  (Array.isArray(names) ? names : [names]).forEach((name: string) => {
    if (!_before[name]) {
      _before[name] = [];
    }

    _before[name] = _before[name].concat(after.flat());
    _before[name] = [...Array.from(new Set(_before[name]))];
  });
};

/**
 * Register task that should be runned after a task.
 *
 * Example
 *   after('build', 'publish', 'log')
 *   after('build', ['publish', 'log'])
 *   after(['build', 'compile'], 'publish')
 */
export const after = (...args: any): void => {
  const names = args[0];
  const before = Array.prototype.slice.call(args, 1);

  if (!Array.isArray(names) && typeof names !== 'string') {
    throw new Error(
      'First argument of `after` should be array of strings or a string'
    );
  }

  (Array.isArray(names) ? names : [names]).forEach((name: string) => {
    if (!_after[name]) {
      _after[name] = [];
    }

    _after[name] = _after[name].concat(before.flat());
    _after[name] = [...Array.from(new Set(_after[name]))];
  });
};

const getTaskName = (name: string, prefix = ''): string => {
  const names = name.split(':');
  const lastName = names.pop();
  names.push(`${prefix}${lastName}`);
  return names.join(':');
};

/**
 * Execute task.
 *
 * @param {string} name
 * @param {object} args
 */
const execute = async (name: string, args: any): Promise<void> => {
  if (_before[name]) {
    _before[name].forEach((name: string) => execute(name, args));
  }

  let fn = _module[name] || resolve(name, _module);
  let fnName = name;

  if (typeof fn === 'object' && fn.default) {
    fn = fn.default;
    fnName = `${name}:default`;
  }

  if (typeof fn === 'function') {
    // run pre* tasks.
    execute(getTaskName(fnName, 'pre'), args);

    const startTime = Date.now();
    if (!logger.isSilent()) {
      logger.log(`Starting ${log.color.cyan(`'${name}'`)}`);
    }

    await fn(args);

    const time = Date.now() - startTime;
    if (!logger.isSilent()) {
      logger.log(
        `Finished ${log.color.cyan(`'${name}'`)} after ${log.color.magenta(
          time + 'ms'
        )}`
      );
    }

    // run post* tasks.
    execute(getTaskName(fnName, 'post'), args);
  }

  if (_after[name]) {
    _after[name].forEach((name: string) => execute(name, args));
  }
};

/**
 * Run pinefile or show help.
 *
 * @param {ArgumentsType} args
 */
export const runFile = (args: ArgumentsType): void => {
  const name = args._.shift();
  const _file = findFile(args.file);

  try {
    // eslint-disable-next-line
    _module = require(_file);
    _module = _module.default ? _module.default : _module;
  } catch (err) {
    logger.error(err);
    return;
  }

  if (!_module) {
    logger.error('Pinefile not found');
    return;
  }

  if (!name) {
    logger.error('No task provided');
    return;
  }

  if (!_module[name] && !resolve(name, _module)) {
    logger.error(`Task ${log.color.cyan(`'${name}'`)} not found`);
    return;
  }

  execute(name, args);
};

export * from './plugins/file';
export * from './plugins/shell';
export const log = logger;
