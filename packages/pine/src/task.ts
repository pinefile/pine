import * as logger from './log';
import { ArgumentsType } from './types';
import { resolve } from './utils';

const _before = {};
const _after = {};

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
 * @param {object} pinefile
 * @param {string} name
 * @param {object} args
 */
const execute = async (
  pinefile: any,
  name: string,
  args: ArgumentsType
): Promise<void> => {
  if (_before[name]) {
    _before[name].forEach((name: string) => execute(pinefile, name, args));
  }

  let fn = pinefile[name] || resolve(name, pinefile);
  let fnName = name;

  if (typeof fn === 'object' && fn.default) {
    fn = fn.default;
    fnName = `${name}:default`;
  }

  if (typeof fn === 'function') {
    // run pre* tasks.
    execute(pinefile, getTaskName(fnName, 'pre'), args);

    const startTime = Date.now();
    if (!logger.isSilent()) {
      logger.log(`Starting ${logger.color.cyan(`'${name}'`)}`);
    }

    await fn(args);

    const time = Date.now() - startTime;
    if (!logger.isSilent()) {
      logger.log(
        `Finished ${logger.color.cyan(
          `'${name}'`
        )} after ${logger.color.magenta(time + 'ms')}`
      );
    }

    // run post* tasks.
    execute(pinefile, getTaskName(fnName, 'post'), args);
  }

  if (_after[name]) {
    _after[name].forEach((name: string) => execute(pinefile, name, args));
  }
};

/**
 * Run task in pinefile.
 *
 * @param {object} pinefile
 * @param {string} name
 * @param {object} args
 */
export const runTask = (pinefile: any, name: string, args: ArgumentsType) => {
  if (!pinefile) {
    logger.error('Pinefile not found');
    return;
  }

  if (!name) {
    logger.error('No task provided');
    return;
  }

  if (!pinefile[name] && !resolve(name, pinefile)) {
    logger.error(`Task ${logger.color.cyan(`'${name}'`)} not found`);
    return;
  }

  return execute(pinefile, name, args);
};
