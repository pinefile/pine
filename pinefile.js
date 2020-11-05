const isDev = process.env.PINE_ENV === 'development';
const { pkg, run, shell, log } = require(`./packages/pine${
  isDev ? '/src' : ''
}`);

const getLatestCommit = async () => await shell(`git rev-parse --short HEAD`);

const npm = (c) => run(`npm run ${c}`);

let { scripts } = pkg();

Object.keys(scripts).forEach((key) => {
  const cmd = scripts[key];
  scripts[key] = async () => await run(cmd);
});

module.exports = {
  ...scripts,
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
  obj: {
    prebuild: () => console.log('obj:prebuild'),
    build: () => console.log('obj:build'),
    postbuild: () => console.log('obj:postbuild'),
  },
  print: async () => console.log(`hello ${process.env.NAME}`),
  say: async () => await run('NAME="nils" npm run pine:dev print'),
};
