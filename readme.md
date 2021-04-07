<div align="center">
  <a href="https://github.com/pinefile/pine">
    <img src="https://avatars.githubusercontent.com/u/70938295?s=200&v=4" width="100px" height="100px" />
  </a>
</div>

# Pine [![Build Status](https://github.com/pinefile/pine/workflows/build/badge.svg)](https://github.com/pinefile/pine/actions)

> Work in progress, API may change before first stable release.

Small JavaScript-based task runner for node.js.

## Docs

Read the documentation [here](/docs)

## Basic usage

Create `Pinefile` or `pinefile.js`

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

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
