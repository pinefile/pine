extend({
  npm: (c) => {
    const { execSync } = require('child_process');
    execSync(`npm ${c}`);
  },
});

load('./plugins/echo.js');
after('build', 'done');

module.exports = {
  build: () => {
    echo(`Building ${pkg().version}...`);
  },
  test: () => {
    npm('test');
  },
  done: () => {
    echo('All done');
  }
}
