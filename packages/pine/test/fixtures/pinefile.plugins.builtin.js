const { pkg, readJSON, writeJSON, shell } = require('../../src');

exports.pkg = () => console.log(`pkg: ${pkg().version}`);
