import yargs, { Arguments as YArguments, Options as YOptions } from 'yargs';
import { isObject, omit } from '@pinefile/utils';
import unparse from 'yargs-unparser';
import path from 'path';
import { findFile } from './file';
import { getConfig } from './config';

export type Arguments = {
  [key in keyof YArguments<any>]: YArguments<any>[key];
};

const defaultOptions: Options = {
  help: {
    alias: 'h',
    type: 'boolean',
    default: false,
    desc: 'Print help and available tasks',
  },
  file: {
    alias: 'f',
    type: 'string',
    default: '',
    desc: 'Path to the Pine file',
  },
  dotenv: {
    type: 'boolean',
    default: false,
    desc: 'Auto load of .env',
  },
  noColor: {
    type: 'boolean',
    default: false,
    desc: 'Disabling of color',
  },
  logLevel: {
    type: 'string',
    default: 'info',
    desc: 'Set log level: info | warn | error | silent',
  },
  require: {
    alias: 'r',
    type: 'array',
    default: [],
    desc: 'Packages to preload before Pinefile is loaded',
  },
  quiet: {
    alias: 'q',
    type: 'boolean',
    default: false,
    desc: 'Sets the log level to silent',
  },
};

export type Options = {
  [key: string]: YOptions;
};

export const options = (): Options => {
  const conf = getConfig();
  return {
    ...defaultOptions,
    ...(isObject(conf.options) ? conf.options : {}),
  };
};

let args: Arguments = {};

export const getArgs = (): Arguments => args;

export const parse = (argv: any[], opts?: Options): Arguments => {
  args = yargs
    .parserConfiguration({
      // https://github.com/yargs/yargs/issues/1011
      'boolean-negation': false,
    })
    .help(false)
    .options(opts ? opts : options())
    .pkgConf('pine', path.dirname(findFile('package.json')))
    .parse(argv);

  // remove keys with dashes, e.g 'no-color' and keep 'noColor'
  Object.keys(args).forEach((key: string) => {
    if (key.indexOf('-') !== -1) {
      args = omit(key, args);
    }
  });

  return args;
};

export const filterArgs = (args: Arguments): Arguments => {
  Object.keys(defaultOptions).forEach((key: string) => {
    if (defaultOptions[key].alias) {
      args = omit(defaultOptions[key].alias as string, args);
    }
    args = omit(key, args);
  });

  return args;
};

export const unparseArgs = (args: Arguments) =>
  unparse({
    ...args,
    _: args._,
    $0: args.$0,
  });
