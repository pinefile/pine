exports.default = function (argv) {
  console.log('Default...');
};

exports.build = function (argv) {
  console.log('Building...');
};

exports.sliceNameFromArgv = function (argv) {
  console.log(`Argv length ${argv._.length}`);
};
