const isDev = process.env.PINE_ENV === 'development';

// eslint-disable-next-line
const { configure, log, run, getConfig } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

// eslint-disable-next-line
const { execRun } = require(`./packages/monorepo${isDev ? '/src' : ''}`);

// enkelt
configure({
  aliases: {
    // pine jest => pine test
    jest: 'pine:test',
    // pine test => jest
    test: 'jest',
    // pine monorepo:test
    monorepo: {
      test: 'jest',
      pine: {
        test: 'pine:test',
      },
    },
  },
});

// jobbigt
module.exports = {
  test: async (argv) => {
    await run`jest ${argv._.join(' ')}`;
  },
};
