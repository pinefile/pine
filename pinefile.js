const isDev = process.env.PINE_ENV === 'development';
const { log, run, getConfig, useRun } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

const jest = useRun('jest');
const npm = useRun('npm run');

module.exports = {
  build: async () => {
    await npm('build');
  },
  config: () => {
    const config = getConfig();
    log.info(config);
  },
  test: async (argv) => {
    await jest(argv._.join(' '));
  },
};
