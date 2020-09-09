load('./plugins/npm.js');

exports.test = function (argv) {
  npm('test');
};
