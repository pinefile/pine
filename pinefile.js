const isDev = process.env.PINE_ENV === 'development';
const { run } = require(`./packages/pine${isDev ? '/src' : ''}`);

const npm = (c) => run(`npm run ${c}`);

module.exports = {
  build: async () => {
    await npm('build');
  },
  test: async (argv) => {
    await run(`jest ${argv._.join(' ')}`);
  },
};
