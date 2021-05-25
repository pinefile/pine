import { isObject, omit } from '@pinefile/utils';
import { ArgumentsType } from './args';
import { ConfigType } from './config';
import { PineFileType } from './file';

export type RunnerOptionsType = { [key: string]: any };

export type RunnerType = (
  pinefile: PineFileType,
  name: string,
  args: ArgumentsType,
  options?: RunnerOptionsType
) => any;

const isValidRunnerObject = (runner: any) =>
  isObject(runner) &&
  (typeof runner.default === 'function' || typeof runner.runner === 'function');

export const getRunner = (config: Partial<ConfigType>): any => {
  let runner: any = false;
  let options: any = {};
  let rest: any = {};

  if (typeof config.runner === 'function') {
    runner = config.runner;
  } else if (isValidRunnerObject(config.runner)) {
    runner = config.runner;
  } else if (typeof config.runner === 'string') {
    try {
      runner = require(config.runner);
    } catch (err) {
      err.message = `Failed to load runner ${err.message}`;
      throw err;
    }
  } else if (
    Array.isArray(config.runner) &&
    config.runner.length >= 1 &&
    !Array.isArray(config.runner[0])
  ) {
    runner = getRunner({ runner: config.runner[0] }).runner;
    options = isObject(config.runner[1]) ? config.runner[1] : {};
  }

  if (isValidRunnerObject(runner)) {
    rest = runner;
    if (runner.runner) {
      rest = omit('runner', rest);
      runner = runner.runner;
    } else {
      rest = omit('default', rest);
      runner = runner.default;
    }
  }

  if (runner !== false && typeof runner !== 'function') {
    throw new Error(
      `Expected runner function to be a function, got ${
        runner === null ? 'null' : typeof runner
      }`
    );
  }

  return { runner, options, ...rest };
};

export const createRunner =
  (fn: RunnerType) =>
  async (
    pinefile: PineFileType,
    name: string,
    args: ArgumentsType,
    options?: RunnerOptionsType
  ) =>
  async () =>
    await fn(pinefile, name, args, options);
