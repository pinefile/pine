const isDev = process.env.PINE_ENV === 'development';
const { shell } = require(isDev ? './packages/pine/src' : './');

const npm = (c) => shell(`npm run ${c}`, {
  outputStream: process.stdout,
})

module.exports = {
  build: () => {
    npm('build')
  },
  test: () => {
    npm('test')
  },
  hello: () => {
    console.log('hello')
  }
};
