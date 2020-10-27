const { after, shell } = require('@pinefile/pine');
const { echo } = require('./plugins/echo');

const getLatestCommit = async () => await shell(`git rev-parse --short HEAD`);

// run tasks after build task
after('build', 'done');

module.exports = {
  build: async () => {
    const version = await getLatestCommit();
    echo(`Building ${version}...`);
  },
  done: () => {
    echo('All done');
  },
};
