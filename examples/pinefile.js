const { after, before, pkg, file, shell } = require('@pinefile/pine')
const { echo } = require('./plugins/echo')

const npm = (c) => shell(`npm run ${c}`, {
  outputStream: process.stdout,
})

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
