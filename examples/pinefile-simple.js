const { pkg, shell } = require('@pinefile/pine');
const { echo } = require('./plugins/echo');

const npm = (c) =>
  shell(`npm run ${c}`, {
    outputStream: process.stdout,
  });

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
