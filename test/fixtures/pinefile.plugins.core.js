exports.pkg = () => console.log(`pkg: ${pkg().version}`);

exports.readJSON = () =>
  console.log(`readJSON: ${readJSON('./package.json').version}`);

exports.writeJSON = () => writeJSON('./file.json', { version: '1.0.0' });
