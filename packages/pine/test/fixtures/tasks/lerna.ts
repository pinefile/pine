import { delay } from '../../utils';

module.exports = {
  predefault: () => console.log('lerna:predefault'),
  default: () => console.log('lerna:default'),
  postdefault: async () => {
    await delay(500);
    console.log('lerna:postdefault');
  },
  prebuild: () => console.log('lerna:prebuild'),
  build: () => console.log('lerna:build'),
  postbuild: () => console.log('lerna:postbuild'),
};
