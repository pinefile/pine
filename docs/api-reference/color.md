# color

Pine use [chalk] under the hood and exports it as `color`. So everything you can do with `chalk` you can do with the `color` export.

```js
const { log, color } = require('@pinefile/pine');

module.exports = {
  example: () => {
    log.info(color.cyan('Foo'));
  },
};
```
