exports.build = function (argv) {
  console.log(`Building ${pkg().version} using pkg...`);
  console.log(`Building ${json('./package.json').version} using json...`);
};
