import path from 'path';
import { camelCaseToDash, isObject } from '@pinefile/utils';
import { parse, options } from './args';
import { setupColor } from './color';
import { configure, Config, getConfig } from './config';
import { runTask, validTaskValue } from './task';
import { loadPineFile, PineFile, findFile } from './file';
import { internalLog } from './logger';

/**
 * Print help text.
 */
const help = (): void => {
  const opts = options();
  const keys = Object.keys(opts).map((key) => ({
    key,
    alias: opts[key].alias,
    flag: camelCaseToDash(key),
  }));

  const len =
    keys.reduce((c, v) => (c.flag.length > v.flag.length ? c : v)).flag.length +
    2;
  console.log(`Usage: pine <task> <options>

Options:`);
  keys.forEach((key) => {
    let space = '';

    for (let i = 0; i < len - key.flag.length; i++) {
      space += ' ';
    }

    console.log(
      `  ${key.alias ? `-${key.alias}, ` : `    `}--${key.flag}${space}${
        opts[key.key].desc
      }`
    );
  });
};

/**
 * Print tasks from Pinefile.
 *
 * @param {object} pineFile
 * @param {string} prefix
 */
const printTasks = (pineFile: PineFile, prefix = '') => {
  try {
    const keys = Object.keys(pineFile);

    if (!prefix) {
      console.log('\nTasks:');
    }

    keys.sort((a, b) => a.localeCompare(b));
    keys.forEach((key) => {
      if (!validTaskValue(pineFile[key])) {
        return;
      }

      if (isObject(pineFile[key]) && pineFile[key]._) {
        delete pineFile[key]._;
      }

      console.log(`  ${prefix}${key}`);

      if (isObject(pineFile[key]) && Object.keys(pineFile[key]).length) {
        printTasks(pineFile[key], `${prefix}${key}:`);
      }
    });
  } catch (err) {
    // todo
  }
};

export const runCLI = async (argv: any[]): Promise<any> => {
  try {
    const args = parse(argv);
    const file = findFile(args.file);
    const name = args._.shift() || 'default';

    setupColor(args);

    // configure before pinefile is loaded
    configure((config: Config) => ({
      dotenv: args.dotenv ? ['.env'] : [],
      env: {
        ...(!args.noColor ? { FORCE_COLOR: '1' } : {}),
        ...config.env,
      },
      root: path.dirname(file),
      logLevel: args.quiet ? 'silent' : args.logLevel,
      require: [
        ...(Array.isArray(args.require) ? args.require : []),
        ...config.require,
      ],
      task: name,
    }));

    const { pineFile } = loadPineFile(file);

    if (args.help) {
      help();
      printTasks(pineFile);
      return;
    }

    const config = getConfig();
    const configArgs =
      isObject(config.options) && Object.keys(config.options).length
        ? parse(argv, config.options)
        : {};

    return await runTask(pineFile, name, {
      ...args,
      ...configArgs,
      _: args._,
    });
  } catch (err) {
    if (err instanceof Error) {
      internalLog().error(err);
    }
    return;
  }
};
