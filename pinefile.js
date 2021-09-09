const isDev = process.env.PINE_ENV === 'development';

// eslint-disable-next-line
const { log, run, getConfig } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

// eslint-disable-next-line
const { execRun } = require(`./packages/monorepo${isDev ? '/src' : ''}`);

module.exports = {
  build: async () => {
    await run`npm run build`;
  },
  config: () => {
    const config = getConfig();
    log.info(config);
  },
  test: async (argv) => {
    await run`jest ${argv._.join(' ')}`;
  },
  tsc: async () => {
    await execRun`tsc`;
  },
};
