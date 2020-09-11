# pine

> WIP

Simple Make build tool using JavaScript

## example

Create `Pinefile`

`pkg` function will read `package.json`

```js
module.exports = {
  build: () => {
    console.log(`Building ${pkg().version}...`);
  },
};
```

Run it

```
pine build
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)