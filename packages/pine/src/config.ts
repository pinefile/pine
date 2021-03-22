import { Options as YOptions } from 'yargs';
import { isObject } from '@pinefile/utils';

type ConfigType = {
  [key: string]: any;
  env: NodeJS.ProcessEnv;
  options: {
    [key: string]: YOptions;
  };
};

type ConfigFunctionType = (obj: ConfigType) => ConfigType;

let config: ConfigType = {
  env: {},
  options: {},
};

const setupEnvironment = (config: ConfigType) => {
  if (!isObject(config.env)) {
    return;
  }

  for (const key in config.env) {
    process.env[key.toUpperCase()] = config.env[key];
  }
};

export const getConfig = (): ConfigType => {
  return config;
};

export const configure = (newConfig: ConfigType | ConfigFunctionType) => {
  if (typeof newConfig === 'function') {
    // Pass the existing config out to the provided function
    // and accept a delta in return
    newConfig = newConfig(config);
  }

  config = {
    ...config,
    ...newConfig,
  };

  setupEnvironment(config);
};
