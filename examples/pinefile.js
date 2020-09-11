extend({
  npm: (c) => {
    const { execSync } = require('child_process');
    execSync(`npm ${c}`);
  },
});

load('./plugins/echo.js');

exports.build = function (argv) {
  echo(`Building ${pkg().version}...`);
};

exports.done = function (argv) {
  echo('All done');
};

exports.test = function (argv) {
  npm('test');
};

after('build', 'done');
