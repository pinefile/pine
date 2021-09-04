const isDev = process.env.PINE_ENV === 'development';
const { log, run, getConfig } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);
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
    await run`jest ${argv._.join(' ')}`;
  },
  compile: async () => {
    await execRun`tsc`;
  },
};
