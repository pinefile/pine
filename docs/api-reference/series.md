# series

Run tasks that will be executed one after another, in sequential order.

## combined tasks into one

You can combine tasks into one, e.g have a default task for building everything.

```js
const { series } = require('@pinefile/pine');

module.exports = {
  example: series('line', 'build'),
  lint: () => {},
  build: () => {},
};
```

## run multiple functions in series

Support both `callback`-format and asynchronous functions.

```js
const { log, series } = require('@pinefile/pine');

module.exports = {
  example: async () => {
    const tasks = [
      (done) => {
        log.push('callback');
        done();
      },
      async () => {
        return new Promise((resolve) => {
          log.info('async');
          resolve();
        });
      },
    ];

    await series(tasks);
  },
};
```
