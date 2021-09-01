import { isObject, omit } from '@pinefile/utils';
import { Arguments } from './args';
import { Config } from './config';
import { PineFile } from './file';

export type RunnerOptions = Record<string, any>;

export type Runner = (
  pinefile: PineFile,
  name: string,
  args: Arguments,
  options?: RunnerOptions
) => any;

const isValidRunnerObject = (runner: any) =>
  isObject(runner) &&
  (typeof runner.default === 'function' || typeof runner.runner === 'function');

export const getRunner = (config: Partial<Config>): any => {
  let runner: any = false;
  let options: Record<string, any> = {};
  let rest: Record<string, any> = {};

  if (typeof config.runner === 'function') {
    runner = config.runner;
  } else if (isValidRunnerObject(config.runner)) {
    runner = config.runner;
  } else if (typeof config.runner === 'string') {
    try {
      runner = require(config.runner);
    } catch (err) {
      if (err instanceof Error) {
        err.message = `Failed to load runner ${err.message}`;
        throw err;
      }
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
  (fn: Runner) =>
  async (
    pinefile: PineFile,
    name: string,
    args: Arguments,
    options?: RunnerOptions
  ) =>
  async () =>
    await fn(pinefile, name, args, options);
