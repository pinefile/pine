module.exports = {
  predefault: () => console.log('lerna:predefault'),
  default: () => console.log('lerna:default'),
  postdefault: () => console.log('lerna:postdefault'),
  prebuild: () => console.log('lerna:prebuild'),
  build: () => console.log('lerna:build'),
  postbuild: () => console.log('lerna:postbuild'),
};
