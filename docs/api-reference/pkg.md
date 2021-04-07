## pkg

Get closest `package.json` object.

```js
const { pkg } = require('@pinefile/pine');

module.exports = {
  example: () => {
    console.log(`Package version: ${pkg().version}`);
  },
};
```
