const isDev = process.env.PINE_ENV === 'development';
const { run, shell, log } = require(`./packages/pine${isDev ? '/src' : ''}`);

const getLatestCommit = async () => await shell(`git rev-parse --short HEAD`);

const npm = (c) => run(`npm run ${c}`);

module.exports = {
  build: async () => {
    await npm('build');
  },
  test: async () => {
    await npm('test');
  },
  hello: async () => {
    const commit = await getLatestCommit();
    log.log(`hello ${commit}`);
  },
  lint: async () => await run(`eslint packages/**/src --ext .ts`),
};
