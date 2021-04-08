const { run } = require('@pinefile/pine');
const { echo } = require('./plugins/echo');

const npm = (c) => run(`npm run ${c}`);

module.exports = {
  build: () => {
    echo(`Building...`);
  },
  test: () => {
    npm('test');
  },
  done: () => {
    echo('All done');
  },
};
