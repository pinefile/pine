module.exports = {
  predefault: async () => await console.log('lerna:predefault'),
  default: async () => await console.log('lerna:default'),
  postdefault: async () => await console.log('lerna:postdefault'),
  prebuild: async () => await console.log('lerna:prebuild'),
  build: async () => await console.log('lerna:build'),
  postbuild: async () => await console.log('lerna:postbuild'),
};
