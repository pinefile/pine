const minimist = require('minimist');

const Parse = (argv: Array<any>) => {
  const obj: any = minimist(argv);

  obj.get = function (key: any) {
    if (this[key]) {
      return this[key];
    }

    if (this._[key]) {
      return this._[key];
    }
  };

  return obj;
};

export default Parse;
