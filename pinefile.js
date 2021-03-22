const isDev = process.env.PINE_ENV === 'development';
const { run, log, configure } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

configure({
  options: {
    name: {
      default: 'world',
    },
  },
});

module.exports = {
  prebuild: () => console.log('prebuild task'),
  postbuild: () => console.log('postbuild task'),
  build: async () => {
    await npm('build');
  },
  test: async (argv) => {
    await run(`jest ${argv._.join(' ')}`);
  },
  argv: async (argv) => {
    console.log(argv);
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
