# log

Pine has a built-in logger which support different log levels. You can [configure](config.md) this or set `process.env.LOG_LEVEL`

## info

```js
const { log } = require('@pinefile/pine');

module.exports = {
  example: () => {
    log.info('Foo');
  },
};
```

## warn

```js
const { log } = require('@pinefile/pine');

module.exports = {
  example: () => {
    log.warn('Foo');
  },
};
```

## error

```js
const { log } = require('@pinefile/pine');

module.exports = {
  example: () => {
    log.error('Foo');
  },
};
```
