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

All Execa [options](https://github.com/sindresorhus/execa#options) can be used.
