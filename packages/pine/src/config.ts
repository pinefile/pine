import { Options as YOptions } from 'yargs';

type ConfigType = {
  options: {
    [key: string]: YOptions;
  };
};

type ConfigFunctionType = (obj: ConfigType) => ConfigType;

let config: ConfigType = {
  options: {},
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
};
