import { parse, options } from './args';
import { runTask } from './task';
import { findFile } from './file';
import * as logger from './logger';
import { ArgumentsType } from './types';

/**
 * Print help text.
 */
const help = (): void => {
  const opts = options();
  const len =
    Object.keys(opts).reduce((c, v) => (c.length > v.length ? c : v)).length +
    2;
  console.log(`Usage: pine <task> <options>

Options:`);
  Object.keys(opts).forEach((flag) => {
    let space = '';

    for (let i = 0; i < len - flag.length; i++) {
      space += ' ';
    }

    console.log(`  --${flag}${space}${opts[flag].desc}`);
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

    // eslint-disable-next-line
    const obj = require(_file);
    const keys = Object.keys(obj);

    console.log('\nTasks:');

    keys.sort((a, b) => a.localeCompare(b));
    keys.forEach((key) => {
      console.log(`  ${key}`);
    });
  } catch (err) {
    // todo
  }
};

const setEnvironment = (args: ArgumentsType) => {
  // set log level by default.
  if (args.silent) {
    process.env.LOG_LEVEL = 'silent';
  }

  // turn on colors by default
  if (!args.noColor) {
    process.env.FORCE_COLOR = '1';
  }
};

export const runCLI = async (argv: Array<any>): Promise<any> => {
  try {
    const args = parse(argv);

    setEnvironment(args);

    const req = ((Array.isArray(args.requires)
      ? args.requires
      : [args.requires]) as Array<string>).filter((r) => r);
    req.forEach(require);

    let pinefile;

    // eslint-disable-next-line
    pinefile = require(findFile(args.file));
    pinefile = pinefile.default ? pinefile.default : pinefile;

    const name = args._.shift();
    if (!name || args.help) {
      help();
      printTasks(args.file);
      return;
    }

    return await runTask(pinefile, name, args);
  } catch (err) {
    logger.error(err);
    return;
  }
};
