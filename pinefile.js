const isDev = process.env.PINE_ENV === 'development';
const { shell, run, getConfig } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

const npm = (c) => run(`npm run ${c}`);

module.exports = {
  build: async () => {
    await npm('build');
  },
  config: () => {
    const config = getConfig();
    console.log(config);
  },
  test: async (argv) => {
    await run(`jest ${argv._.join(' ')}`);
  },
};
