# plugin

There is to kind of plugins in Pine:

- Standalone functions, e.g [shell](../api-reference/shell.md) and [run](../api-reference/run.md)
- Task function that takes three arguments and return a promise.

## standalone functions

Most of the functions that Pine exports is standalone functions, e.g [shell](../api-reference/shell.md) and [run](../api-reference/run.md), so writing your own functions is easy. You can use build-it functions like the [getConfig](../api-reference/config.md) to receive the configuration object.

```js
const echo = console.log;

module.exports = {
  example: () => {
    echo('Foo');
  },
};
```

## runner function

This one is a bit more complex since the function you assign to the task takes three arguments which are the exported object from the Pinefile, the name of the task and a array of arguments.

The returning function can take a `done` callback argument where you can send in errors. You can also return a promise reject.

```js
module.exports = {
  example: (pinefile, name, argv) => {
    return () => {
      console.log(name);
    };
  },
};
```

You can see different example of runner functions [here](../../packages/pine/test/fixtures/pinefile.runner.js)
