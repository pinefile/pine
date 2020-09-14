const { after, before, pkg, file } = require('../src')
const { echo } = require('./plugins/echo')

const npm = (c) => {
  const { execSync } = require('child_process');
  execSync(`npm ${c}`);
}

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
