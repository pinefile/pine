# pine [![Build Status](https://github.com/pinefile/pine/workflows/build/badge.svg)](https://github.com/pinefile/pine/actions)

Small task runner for node.js

## example

Create `Pinefile` or `pinefile.js`

```js
const { pkg, run } = require('@pinefile/pine');

module.exports = {
  build: () => {
    console.log(`Building ${pkg().version}...`);
  },
  test: async () => {
    await run('jest');
  }
};
```

`pkg` function will read closest `package.json`

Then run it! It is best to either place `pine` inside a npm run script or run it with `npx`:

```
npx pine build
```

## transpilers

Example of how to use Babel transpiler for your `pinefile.js`

```json
{
  "pine": {
    "requires": [
      "@babel/register"
    ]
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
    "requires": [
      "ts-node/register"
    ]
  },
  "devDependencies": {
    "ts-node": "^9.0.0",
    "typescript": "^4.0.5"
  }
}
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
