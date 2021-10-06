const { echo } = require('./plugins/echo');
const { npm } = require('./plugins/npm');

exports.echo = function (argv) {
  echo('Echo...');
};

exports.test = function (argv) {
  npm('run echo');
};
