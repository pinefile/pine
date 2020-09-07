exports.build = function (argv) {
  console.log('Building...');
};

exports.done = function (argv) {
  console.log('All done');
};

after('build', 'done');
