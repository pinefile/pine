import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { isObject } from '@pinefile/utils';
import { OptionsType } from './args';
import { LogLevel } from './logger';

export type ConfigType = {
  /**
   * Dynamic config properties.
   */
  [key: string]: any;

  /**
   * Array of dotenv files to load from root.
   */
  dotenv: string[];

  /**
   * Object of process env.
   */
  env: NodeJS.ProcessEnv;

  /**
   * Log level.
   * Default: 'info'
   */
  logLevel: LogLevel;

  /**
   * Yargs options.
   */
  options: OptionsType;

  /**
   * Directory of Pinefile
   */
  root: string;

  /**
   * Packages to preload before Pinefile is loaded.
   */
  require: string[];

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
export type ConfigFunctionType = (cfg: ConfigType) => ConfigType;

let config: ConfigType = {
  dotenv: [],
  env: {},
  logLevel: 'info',
  options: {},
  root: '',
  require: [],
  task: '',
};

const loadDotenv = (config: ConfigType) => {
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

const loadModules = (config: ConfigType) => {
  if (!Array.isArray(config.require)) {
    return;
  }

  config.require = config.require.filter((file) => {
    // eslint-disable-next-line
    require(file);
    return false;
  });
};

const setEnvironment = (config: ConfigType) => {
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

export const getConfig = (): ConfigType => {
  return config;
};

/**
 * Pine can be configured via the configure function, which accepts:
 *
 * > A plain JavaScript object, this will be merged into the existing configuration.
 *
 *   configure({
 *     dotenv: ['my.env'],
 *   })
 *
 * > A function the function will be given the existing configuration and the task name as a optional argument.
 * > The function should return a plain JavaScript object which will be merged into the existing configuration.
 *
 *   configure((config) => ({
 *     dotenv: ['my.env'],
 *   }))
 */
export const configure = (
  newConfig: Partial<ConfigType> | ConfigFunctionType
): ConfigType => {
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
