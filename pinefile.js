const isDev = process.env.PINE_ENV === 'development';
const { run, shell, log } = require(`./packages/pine${isDev ? '/src' : ''}`);

const getLatestCommit = async () => await shell(`git rev-parse --short HEAD`);

const npm = (c) => run(`npm run ${c}`);

module.exports = {
  prebuild: () => console.log('prebuild task'),
  postbuild: () => console.log('postbuild task'),
  build: async () => {
    await npm('build');
  },
  test: async () => {
    await run('jest');
  },
  hello: async () => {
    const commit = await getLatestCommit();
    log.log(`hello ${commit}`);
  },
  print: async () => console.log(`hello ${process.env.NAME}`),
  say: async () => await run('NAME="nils" npm run pine:dev print'),
};
