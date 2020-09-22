const { before } = require('../../src');

exports.build = function (argv) {
  console.log('Building...');
};

exports.compile = function (argv) {
  console.log('Compiling...');
};

exports.write = function (argv) {
  console.log('Write...');
};

before('build', 'compile', 'write', 'compile');

exports.array = function (argv) {
  console.log('Array...');
};

before('array', ['compile']);
