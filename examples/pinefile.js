// extend with custom plugins
extend({
  // with function
  npm: (c) => {
    const { execSync } = require('child_process');
    execSync(`npm ${c}`);
  },
  // with file
  echo: require('./plugins/echo.js'),
});

// run tasks after build task
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
