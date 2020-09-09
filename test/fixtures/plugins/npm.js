// sync for testing.
const { execSync } = require('child_process');
module.exports = {
  npm: (c) => {
    const p = execSync(`npm ${c}`, {
      cwd: __dirname + '/..',
    });
    console.log(p.toString());
  },
};
