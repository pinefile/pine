const { pkg, readJSON, writeJSON, shell } = require('../../src');

exports.pkg = () => console.log(`pkg: ${pkg().version}`);

exports.readJSON = () =>
  console.log(`readJSON: ${readJSON('./package.json').version}`);

exports.writeJSON = () =>
  writeJSON(`${__dirname}/write.json`, { version: '1.0.0' });
