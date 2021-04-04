import yargs, { Arguments as YArguments, Options as YOptions } from 'yargs';
import { isObject } from '@pinefile/utils';
import { findFile } from './file';
import * as logger from './logger';
import { getConfig } from './config';

export type ArgumentsType = {
  [key in keyof YArguments<any>]: YArguments<any>[key];
};

const defaultOptions: OptionsType = {
  help: { type: 'boolean', default: false, desc: 'Show help' },
  file: {
    type: 'string',
    default: '',
    desc: 'Path to Pipefile or pipefile.js',
  },
  noDotenv: {
    type: 'boolean',
    default: false,
    desc: 'Disabling auto load of .env',
  },
  noColor: {
    type: 'boolean',
    default: false,
    desc: 'Disabling of color',
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

export type OptionsType = {
  [key: string]: YOptions;
};

export const options = (): OptionsType => {
  const conf = getConfig();
  return {
    ...defaultOptions,
    ...(isObject(conf.options) ? conf.options : {}),
  };
};

export const parse = (argv: Array<any>): ArgumentsType => {
  let args: ArgumentsType = yargs
    .parserConfiguration({
      // https://github.com/yargs/yargs/issues/1011
      'boolean-negation': false,
    })
    .help(false)
    .options(options())
    .parse(argv);

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
