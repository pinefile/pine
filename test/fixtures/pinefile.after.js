const { after } = require('../../src');

exports.build = function (argv) {
  console.log('Building...');
};

exports.compile = function (argv) {
  console.log('Compiling...');
};

exports.write = function (argv) {
  console.log('Write...');
};

after('build', 'compile', 'write', 'compile');

exports.array = async function (argv) {
  console.log('Array...');
};

after('array', ['compile']);
