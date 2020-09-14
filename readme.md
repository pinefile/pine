# pine

> WIP

Simple Make build tool using JavaScript

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

`pkg` function will read `package.json`

Then run it with

```
pine build
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)