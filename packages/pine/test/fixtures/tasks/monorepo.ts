import { delay } from '../../utils';

module.exports = {
  predefault: () => console.log('monorepo:predefault'),
  default: () => console.log('monorepo:default'),
  postdefault: async () => {
    await delay(500);
    console.log('monorepo:postdefault');
  },
  prebuild: () => console.log('monorepo:prebuild'),
  build: () => console.log('monorepo:build'),
  postbuild: () => console.log('monorepo:postbuild'),
};
