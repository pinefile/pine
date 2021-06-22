import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { isObject } from '@pinefile/utils';
import { Options } from './args';
import { LogLevel } from './logger';
import { Runner } from './runner';

export type Config = {
  /**
   * Dynamic config properties.
   */
  [key: string]: any;

  /**
   * Array of dotenv files to load from root.
   */
  dotenv: string[];

  /**
   * Environment key-value pairs.
   */
  env: NodeJS.ProcessEnv;

  /**
   * Log level.
   *
   * @default 'info'
   */
  logLevel: LogLevel;

  /**
   * Yargs options, key-value pairs.
   *
   * @link https://yargs.js.org/docs/#api-reference-optionskey-opt
   */
  options: Options;

  /**
   * Packages to preload before Pinefile is loaded.
   */
  require: string[];

  /**
   * Directory of Pinefile
   */
  root: string;

  /**
   * Global runner that can be used to customize the runner for all tasks.
   */
  runner?: string | Runner | Record<string, any> | Array<any>;

  /**
   * Task name of the function that is executing.
   */
  task: string;
};

/**
 * Config function
 *
 * configure((config, task) => config)
 */
export type ConfigFunction = (cfg: Config) => Config;

let config: Config = {
  dotenv: [],
  env: {},
  logLevel: 'info',
  options: {},
  root: '',
  require: [],
  task: '',
};

const loadDotenv = (config: Config) => {
  if (!Array.isArray(config.dotenv)) {
    return;
  }

  if (!config.root && config.dotenv.length) {
    throw new Error('Config root cannot be empty when loading dotenv files');
  }

  config.dotenv.forEach((file) => {
    try {
      const dotEnvPath = path.join(config.root, file);
      const stats = fs.statSync(dotEnvPath);

      // make sure to only attempt to read files
      if (!stats.isFile()) {
        return;
      }

      const result = dotenv.config({
        path: dotEnvPath,
      });

      if (result.error) {
        throw result.error;
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  });

  config.dotenv = [];
};

const loadModules = (config: Config) => {
  if (!Array.isArray(config.require)) {
    return;
  }

  config.require = config.require.filter((file) => {
    // eslint-disable-next-line
    require(file);
    return false;
  });
};

const setEnvironment = (config: Config) => {
  if (!isObject(config.env)) {
    return;
  }

  for (const key in config.env) {
    // use the same conditional to set env var as dotenv does
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key.toUpperCase()] = config.env[key];
    }
  }
};

export const getConfig = (): Config => config;

/**
 * Pine can be configured via the configure function, which accepts:
 *
 * > A plain JavaScript object, this will be merged into the existing configuration.
 *
 *   configure({
 *     dotenv: ['my.env'],
 *   })
 *
 * > With a function will be given the existing configuration and the task name as a optional argument.
 * > The function should return a plain JavaScript object which will be merged into the existing configuration.
 *
 *   configure((config) => ({
 *     dotenv: ['my.env'],
 *   }))
 */
export const configure = (
  newConfig: Partial<Config> | ConfigFunction
): Config => {
  if (typeof newConfig === 'function') {
    newConfig = newConfig(config);
  }

  config = {
    ...config,
    ...(isObject(newConfig) ? newConfig : {}),
  };

  loadDotenv(config);
  loadModules(config);
  setEnvironment(config);

  return config;
};
