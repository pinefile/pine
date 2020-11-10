import yargs, { Options } from 'yargs';
import { runFile } from './';
import { findFile } from './file';
import * as logger from './log';
import { ArgumentsType } from './types';

const options: { [key: string]: Options } = {
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

/**
 * Print help text.
 */
const help = (): void => {
  const len = 10;
  console.log(`Usage: pine <task>

Options:`);
  Object.keys(options).forEach((flag) => {
    let space = '';

    for (let i = 0; i < len - flag.length; i++) {
      space += ' ';
    }

    console.log(`  --${flag}${space}${options[flag].desc}`);
  });
};

/**
 * Print tasks from Pinefile.
 *
 * @param {string} file
 */
const printTasks = (file?: string) => {
  try {
    const _file = findFile(file);
    const obj = require(_file);
    const keys = Object.keys(obj);

    console.log('\nTasks:');

    keys.sort((a, b) => a.localeCompare(b));
    keys.forEach((key) => {
      console.log(`  ${key}`);
    });
  } catch (err) {}
};

export const runCLI = (argv: Array<any>) => {
  let args = yargs.options(options).parse(argv) as ArgumentsType;

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
    return;
  }

  // todo
  if (args.silent) {
    process.env.LOG_LEVEL = 'silent';
  }

  const req = ((Array.isArray(args.requires)
    ? args.requires
    : [args.requires]) as Array<string>).filter((r) => r);
  req.forEach(require);

  if (!args._.length || args.help) {
    help();
    printTasks(args.file);
    return;
  }

  return runFile(args);
};
