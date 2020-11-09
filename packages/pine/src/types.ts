import { Arguments as YArguments } from 'yargs';

export type ArgumentsType = {
  [key in keyof YArguments<any>]: YArguments<any>[key];
};

export type PackageType = {
  pine: {
    [key: string]: any;
  };
};
