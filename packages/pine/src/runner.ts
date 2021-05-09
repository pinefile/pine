import { isObject } from '@pinefile/utils';
import { ArgumentsType } from './args';
import { ConfigType } from './config';
import { PineFileType } from './file';

export type RunnerType = (
  pinefile: PineFileType,
  name: string,
  args: ArgumentsType
) => any;

export const getRunner = (
  config: Partial<ConfigType>
): { runner: any; options: { [key: string]: any } } => {
  let runner: any = false;
  let options: any = {};

  if (typeof config.runner === 'function') {
    runner = config.runner;
  } else if (
    isObject(config.runner) &&
    typeof config.runner === 'object' &&
    !Array.isArray(config.runner)
  ) {
    runner = config.runner?.default;
  } else if (typeof config.runner === 'string') {
    try {
      runner = require(config.runner);
      runner = isObject(runner) ? runner.default : runner;
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

  if (runner !== false && typeof runner !== 'function') {
    throw new Error(
      `Expected runner function to be a function, got ${
        runner === null ? 'null' : typeof runner
      }`
    );
  }

  return { runner, options };
};
