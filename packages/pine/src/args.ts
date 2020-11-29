import yargs, { Options as YOptions } from 'yargs';
import { findFile } from './file';
import * as logger from './logger';
import { ArgumentsType } from './types';

const defaultOptions: OptionsType = {
  help: { type: 'boolean', default: false, desc: 'Show help' },
  file: {
    type: 'string',
    default: '',
    desc: 'Path to Pipefile or pipefile.js',
  },
  silent: {
    type: 'boolean',
    default: false,
    desc: 'Runs the task in silent mode',
  },
  requires: {
    type: 'array',
    default: [],
    desc: 'Packages to load before a task is executed',
  },
};

type OptionsType = {
  [key: string]: YOptions;
};

const _options: OptionsType = {};

export const option = (name: string, options: YOptions) => {
  _options[name] = options;
};

export const options = (): OptionsType => ({
  ..._options,
  ...defaultOptions,
});

export const parse = (argv: Array<any>): ArgumentsType => {
  let args: ArgumentsType = yargs.help(false).options(options()).parse(argv);

  try {
    // eslint-disable-next-line
    const pkg = require(findFile('package.json'));
    const pine =
      typeof pkg.pine === 'object' && !Array.isArray(pkg.pine) ? pkg.pine : {};

    args = {
      ...args,
      ...pine,
    } as ArgumentsType;
  } catch (err) {
    logger.error(err);
  }

  return args;
};
