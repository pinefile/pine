const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const isDev = process.env.PINE_ENV === 'development';
const { run, shell, log, option, series, parallel } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

option('name', { default: 'world' });

module.exports = {
  prebuild: () => console.log('prebuild task'),
  postbuild: () => console.log('postbuild task'),
  build: async () => {
    await npm('build');
  },
  test: async () => {
    await run('jest');
  },
  // examples
  commit: async () => {
    const commit = await getLatestCommit();
    log.info(`Hello ${commit}`);
  },
  print: async () => console.log(`Hello ${process.env.NAME}`),
  say: async () => await run('NAME="nils" npm run pine:dev print'),
  sayhello: (argv) => log.info(`Hello ${argv.name}`),
};
