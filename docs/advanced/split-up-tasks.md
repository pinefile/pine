# split up tasks

You can split up tasks in more than one file, e.g having all build tasks in one file:

```js
// tasks/build.js
module.exports = {
  css: () => console.log('build:css'),
  default: () => console.log('build'),
};

// pinefile.js
module.exports = {
  build: require('./tasks/build.js'),
};
```

Then you can run `npx pine build:css`
