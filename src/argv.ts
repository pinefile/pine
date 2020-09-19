import minimist from 'minimist';

type Argv = {
  [key: string]: any;
  get(key: string | number): any;
};

export const parseArgv = (argv: Array<any>): Argv => {
  const obj: any = minimist(argv);

  obj.get = function (key: string | number): any {
    if (this[key]) {
      return this[key];
    }

    if (this._[key]) {
      return this._[key];
    }
  };

  return obj;
};
