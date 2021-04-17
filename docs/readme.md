# docs

## Basic Usage

Create `Pinefile` or `pinefile.js`

```js
const { run } = require('@pinefile/pine');

exports.build = () => {
  console.log('Building...');
};

exports.test = async () => {
  await run('jest');
};
```

or by using `module.exports`

```js
const { run } = require('@pinefile/pine');

module.exports = {
  build: () => {
    console.log('Building...');
  },
  test: async () => {
    await run('jest');
  },
};
```

Then run it! It is best to either place `pine` inside a npm run script or run it with `npx`:

```
npx pine build
```

## Built-in functions:

- [color](api-reference/color.md)
- [configure](api-reference/config.md)
- [log](api-reference/log.md)
- [run](api-reference/run.md)
- [shell](api-reference/shell.md)

## Advanced

- [custom executable](advanced/custom-executable.md)
- [plugins](advanced/plugins.md)
- [split up tasks](advanced/split-up-tasks.md)
- [transpilers](advanced/transpilers.md)
