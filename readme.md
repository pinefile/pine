<div align="center">
  <a href="https://github.com/pinefile/pine">
    <img src="https://avatars.githubusercontent.com/u/70938295?s=200&v=4" width="100px" height="100px" />
  </a>
</div>

# Pine [![Build Status](https://github.com/pinefile/pine/workflows/build/badge.svg)](https://github.com/pinefile/pine/actions)

> Work in progress, API may change before first stable release.

Small JavaScript-based task runner for node.js.

## Usage

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

## Split up tasks

You can split up tasks in more than one file, e.g having all build tasks in one file:

```js
// tasks/build.js
module.exports = {
  css: () => console.log('build:css'),
  default: () => console.log('build'),
};

// pinefile.js
module.exports = {
  build: require('./tasks/build.js'),
};
```

Then you can run `npx pine build:css`

## Transpilers

Example of how to use Babel transpiler for your `pinefile.js`

```json
{
  "pine": {
    "requires": ["@babel/register"]
  },
  "babel": {
    "presets": ["env"]
  },
  "devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "@babel/register": "^7.12.1"
  }
}
```

Example of how to use TypeScript transpiler for your `pinefile.js`

```json
{
  "pine": {
    "requires": ["ts-node/register"]
  },
  "devDependencies": {
    "ts-node": "^9.0.0",
    "typescript": "^4.0.5"
  }
}
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
