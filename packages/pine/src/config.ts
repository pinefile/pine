import { isObject } from '@pinefile/utils';
import { ConfigType, ConfigFunctionType } from './types';

let config: ConfigType = {
  env: {},
  options: {},
};

const setEnvironment = (config: ConfigType) => {
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

export const configure = (
  newConfig: ConfigType | ConfigFunctionType
): ConfigType => {
  if (typeof newConfig === 'function') {
    newConfig = newConfig(config);
  }

  config = {
    ...config,
    ...(isObject(newConfig) ? newConfig : {}),
  };

  setEnvironment(config);

  return config;
};
