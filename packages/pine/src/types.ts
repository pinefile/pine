import { Arguments as YArguments, Options as YOptions } from 'yargs';

export type ArgumentsType = {
  [key in keyof YArguments<any>]: YArguments<any>[key];
};

export type ConfigType = {
  [key: string]: any;
  env: NodeJS.ProcessEnv;
  options: {
    [key: string]: YOptions;
  };
};

export type ConfigFunctionType = (obj: ConfigType) => ConfigType;

export type PackageType = {
  pine: {
    [key: string]: any;
  };
};

export type PinefileType = {
  [key: string]: any;
};
