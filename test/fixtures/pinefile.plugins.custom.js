load(__dirname + '/plugins/echo.js');
load(__dirname + '/plugins/npm.js');

exports.echo = function (argv) {
  echo('Echo...');
};

exports.test = function (argv) {
  npm('run echo');
};
