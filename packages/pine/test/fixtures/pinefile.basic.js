exports.default = function (argv) {
  console.log('Default...');
};

exports.build = function (argv) {
  console.log('Building...');
};

exports.sliceNameFromArgv = function (argv) {
  console.log(`Argv length ${argv._.length}`);
};

exports.sayhello = function (argv) {
  console.log(`Hello ${argv.name}`);
};

exports.basic = require('./tasks/basic');
