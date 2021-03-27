const { pkg, shell } = require('@pinefile/pine');
const { echo } = require('./plugins/echo');

const npm = (c) => run(`npm run ${c}`);

module.exports = {
  build: () => {
    echo(`Building ${pkg().version}...`);
  },
  test: () => {
    npm('test');
  },
  done: () => {
    echo('All done');
  },
};
