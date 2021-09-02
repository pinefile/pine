import { camelCaseToDash, isObject } from '@pinefile/utils';
import { parse, options } from './args';
import { runTask, validTaskValue } from './task';
import { findFile, findDirname, loadPineFile, PineFile } from './file';
import { log, setup as setupLogger } from './logger';
import { configure, getConfig, Config } from './config';

/**
 * Print help text.
 */
const help = (): void => {
  const opts = options();
  const keys = Object.keys(opts).map((key) => ({
    key,
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

    console.log(`  --${key.flag}${space}${opts[key.key].desc}`);
  });
};

/**
 * Print tasks from Pinefile.
 *
 * @param {object} pineModule
 * @param {string} prefix
 */
const printTasks = (pineModule: PineFile, prefix = '') => {
  try {
    const keys = Object.keys(pineModule);

    if (!prefix) {
      console.log('\nTasks:');
    }

    keys.sort((a, b) => a.localeCompare(b));
    keys.forEach((key) => {
      if (!validTaskValue(pineModule[key])) {
        return;
      }

      if (isObject(pineModule[key]) && pineModule[key]._) {
        delete pineModule[key]._;
      }

      console.log(`  ${prefix}${key}`);

      if (isObject(pineModule[key]) && Object.keys(pineModule[key]).length) {
        printTasks(pineModule[key], `${prefix}${key}:`);
      }
    });
  } catch (err) {
    // todo
  }
};

export const runCLI = async (argv: any[], load = true): Promise<any> => {
  try {
    const args = parse(argv);
    const pineFile = findFile(args.file);
    const name = args._.shift() || 'default';

    setupLogger(args);

    configure((config: Config) => ({
      dotenv: args.dotenv ? ['.env'] : [],
      env: {
        ...(!args.noColor ? { FORCE_COLOR: '1' } : {}),
        ...config.env,
      },
      root: findDirname(pineFile),
      logLevel: args.logLevel,
      require: [
        ...(Array.isArray(args.require) ? args.require : []),
        ...config.require,
      ],
      task: name,
    }));

    if (!load) {
      return;
    }

    const pineModule = loadPineFile(pineFile);

    if (args.help) {
      help();
      printTasks(pineModule);
      return;
    }

    const config = getConfig();
    const configArgs =
      isObject(config.options) && Object.keys(config.options).length
        ? parse(argv, config.options)
        : {};

    return await runTask(pineModule, name, {
      ...args,
      ...configArgs,
      _: args._,
    });
  } catch (err) {
    if (err instanceof Error) {
      log.error(err);
    }
    return;
  }
};
