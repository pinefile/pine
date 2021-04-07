# docs

## Basic Usage

Create `Pinefile` or `pinefile.js`

```js
const { pkg, run } = require('@pinefile/pine');

exports.build = () => {
  console.log(`Building ${pkg().version}...`);
};

exports.test = async () => {
  await run('jest');
};
```

or by using `module.exports`

```js
module.exports = {
  build: () => {
    console.log(`Building ${pkg().version}...`);
  },
  test: async () => {
    await run('jest');
  },
};
```

`pkg` function will read closest `package.json`

Then run it! It is best to either place `pine` inside a npm run script or run it with `npx`:

```
npx pine build
```

## Built-in functions:

- [color](api-reference/color.md)
- [configure](api-reference/config.md)
- [log](api-reference/log.md)
- [pkg](api-reference/pkg.md)
- [run](api-reference/run.md)
- [shell](api-reference/shell.md)

## Advanced

- [Custom executable](advanced/custom-executable.md)
- [Transpilers](advanced/transpilers.md)
- [Split up tasks](advanced/split-up-tasks.md)
