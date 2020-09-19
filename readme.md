# pine

> WIP

Small task runner for node.js

## example

Create `Pinefile` or `pinefile.js`

```js
const { pkg } = require('pinefile');

module.exports = {
  build: () => {
    console.log(`Building ${pkg().version}...`);
  },
};
```

`pkg` function will read closest `package.json`

Then run it with

```
pine build
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)