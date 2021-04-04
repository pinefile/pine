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
};

export type ConfigFunctionType = (obj: ConfigType) => ConfigType;

let config: ConfigType = {
  dotenv: [],
  env: {},
  logLevel: 'info',
  options: {},
  root: '',
};

const loadDotenv = (config: ConfigType) => {
  if (!Array.isArray(config.dotenv)) {
    return;
  }

  if (!config.root && config.dotenv.length) {
    throw new Error('Config root cannot be empty when loading dotenv files');
  }

  config.dotenv.forEach((file, i) => {
    dotenv.config({
      path: `${path.join(config.root, file)}`,
    });
    delete config.dotenv[i];
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
  setEnvironment(config);

  return config;
};
