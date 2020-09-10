load('./plugins/echo.js');
load('./plugins/npm.js');

exports.build = function (argv) {
  echo('Building...');
};

exports.test = function (argv) {
  npm('test');
};
