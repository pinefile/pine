const isDev = process.env.PINE_ENV === 'development';
const { run } = require(`./packages/pine${isDev ? '/src' : ''}`);

module.exports = {
  build: async () => {
    await npm('build');
  },
  test: async (argv) => {
    await run(`jest ${argv._.join(' ')}`);
  },
};
