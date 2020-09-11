# pine

> WIP

Simple Make build tool using JavaScript

## example

Create `Pinefile`

```js
module.exports = {
  build: () => {
    echo(`Building ${pkg().version}...`);
  },
};
```

Run it

```
pine build
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)