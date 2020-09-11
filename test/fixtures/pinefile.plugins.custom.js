load('./plugins/echo.js');
load('./plugins/npm.js');

exports.echo = function (argv) {
  echo('Echo...');
};

exports.test = function (argv) {
  npm('run echo');
};
