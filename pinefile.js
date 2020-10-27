const isDev = process.env.PINE_ENV === 'development';
const { pkg, run, shell, log } = require(`./packages/pine${isDev ? '/src' : ''}`);

const getLatestCommit = async () => await shell(`git rev-parse --short HEAD`);

const npm = (c) => run(`npm run ${c}`);

let { scripts } = pkg();

Object.keys(scripts).forEach(key => {
  const cmd = scripts[key];
  scripts[key] = async () => await run(cmd);
});

module.exports = {
  ...scripts,
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
};
