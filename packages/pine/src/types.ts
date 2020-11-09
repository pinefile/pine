import { Arguments as YArguments } from 'yargs';

export type ArgumentsType = {
  [key in keyof YArguments<T>]: YArguments<T>[key];
};

export type PackageType = {
  pine: {
    [key: string]: any;
  };
};
