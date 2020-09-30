# pine [![Build Status](https://github.com/pinefile/pine/workflows/build/badge.svg)](https://github.com/pinefile/pine/actions)

> WIP

Small task runner for node.js

## example

Create `Pinefile` or `pinefile.js`

```js
const { pkg } = require('@pinefile/pine');

module.exports = {
  build: () => {
    console.log(`Building ${pkg().version}...`);
  },
};
```

`pkg` function will read closest `package.json`

Then run it! It is best to either place `pine` inside a npm run script or run it with `npx`:

```
npx pine build
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)