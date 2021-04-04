import { Arguments as YArguments, Options as YOptions } from 'yargs';
import { LogLevel } from './logger';

export type ArgumentsType = {
  [key in keyof YArguments<any>]: YArguments<any>[key];
};

export type ConfigType = {
  [key: string]: any;
  dotenv: string[];
  env: NodeJS.ProcessEnv;
  logLevel: LogLevel;
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
