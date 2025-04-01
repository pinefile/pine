import path from 'path';
import { camelCaseToDash, isObject } from '@pinefile/utils';
import { parse, options } from './args';
import { setupColor } from './color';
import { configure, getConfig, Config } from './config';
import { runTask, validTaskValue } from './task';
import { loadPineFile, PineFile, findFile, findGlobalFile } from './file';
import { internalLog } from './logger';
import { setPluginPinefile } from './plugin';

/**
 * Print help options.
 */
const printOptions = () => {
  const opts = options();
  const keys = Object.keys(opts).map((key) => ({
    key,
    alias: opts[key].alias,
    flag: camelCaseToDash(key),
  }));

  const len =
    keys.reduce((c, v) => (c.flag.length > v.flag.length ? c : v)).flag.length +
    2;

  console.log(`
Options:`);

  keys.forEach((key) => {
    let space = '';

    for (let i = 0; i < len - key.flag.length; i++) {
      space += ' ';
    }

    console.log(
      `  ${key.alias ? `-${key.alias}, ` : `    `}--${key.flag}${space}${
        opts[key.key].desc
      }`,
    );
  });
};

/**
 * Print help commands.
 */
const printCommands = () => {
  const commands = [
    {
      key: 'global',
      desc: 'Run tasks in global pinefile',
    },
  ];

  console.log(`
Commands:`);

  const len =
    commands.reduce((c, v) => (c.key.length > v.key.length ? c : v)).key
      .length + 2;
  commands.forEach((key) => {
    let space = '';

    for (let i = 0; i < len - key.key.length; i++) {
      space += ' ';
    }

    console.log(`  ${key.key}${space}${key.desc}`);
  });
};

/**
 * Print help text.
 */
const help = () => {
  console.log(`Usage: pine [<command>] <task> <options>`);
  printOptions();
  printCommands();
};

/**
 * Print tasks from Pinefile.
 *
 * @param {object}  pineFile
 * @param {boolean} global
 * @param {string}  prefix
 */
const printTasks = (pineFile: PineFile, global: boolean, prefix = '') => {
  try {
    const keys = Object.keys(pineFile);

    if (!prefix) {
      console.log(`\nTasks (${global ? 'global' : 'local'}):`);
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
        printTasks(pineFile[key], global, `${prefix}${key}:`);
      }
    });
  } catch (err) {
    // todo
  }
};

/**
 * Run Pine CLI.
 *
 * @param   {array} argv
 *
 * @returns {Promise}
 */
export const runCLI = async (argv: any[]): Promise<any> => {
  try {
    const global = argv[0] === 'global';
    const args = parse(global ? argv.slice(1) : argv);
    const file = global ? findGlobalFile() : findFile(args.file);

    if (!file) {
      if (args.help) {
        help();
      } else {
        internalLog().error(
          global
            ? 'No global pinefile was found in your home folder or the ~/.pine directory.'
            : 'No pinefile was found.',
        );
      }
      return;
    }

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
        config.esbuild && 'esbuild-register',
        ...(Array.isArray(args.require) ? args.require : []),
        ...config.require,
      ].filter(Boolean),
      task: name,
    }));

    const { pineFile } = loadPineFile(file);

    if (args.help) {
      help();
      printTasks(pineFile, global);
      return;
    }

    const config = getConfig();
    const configArgs =
      isObject(config.options) && Object.keys(config.options).length
        ? parse(argv, config.options)
        : {};

    const argsObj = {
      ...args,
      ...configArgs,
      _: args._,
    };

    setPluginPinefile(pineFile, name, argsObj);

    return await runTask(pineFile, name, argsObj);
  } catch (err) {
    if (err instanceof Error) {
      internalLog().error(err);
    }
    return;
  }
};
