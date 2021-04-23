# shell

Run shell commands and returning output instead of log as [run](./run.md) function does.

## usage

```js
const { shell } = require('@pinefile/pine');

module.exports = {
  example: async () => {
    const gitLatestCommitID = await shell('git rev-parse HEAD');
  },
};
```

## options

All Execa [options](https://github.com/sindresorhus/execa#options) can be used. Pine has some default values that are different from Execa:

*  `shell` option is default `true` instead of `false` so shell-specific features can be used (for or example, `&&` or `||`)
