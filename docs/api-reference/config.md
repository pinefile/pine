## configure

Pine can be configured via the `configure` function, which accepts:

# With object

The object will be merged into the existing configuration.

```js
const { configure } = require('@pinefile/pine');

configure({
  // see options
});

module.exports = {
  // tasks
};
```

# With function

The function will be given the existing configuration and the task name as a optional argument. The function should return a plain JavaScript object which will be merged into the existing configuration.

```js
const { configure } = require('@pinefile/pine');

configure((config) => ({
  // see options
}));

module.exports = {
  // tasks
};
```

### options

```js
{
  /**
   * Dynamic config properties.
   */
  [key: string]: any;

  /**
   * Array of dotenv files to load from root.
   */
  dotenv: string[];

  /**
   * Environment key-value pairs.
   */
  env: NodeJS.ProcessEnv;

  /**
   * Log level.
   *
   * @default 'info'
   */
  logLevel: 'error' | 'warn' | 'info' | 'silent';

  /**
   * Yargs options, key-value pairs.
   *
   * @link https://yargs.js.org/docs/#api-reference-optionskey-opt
   */
  options: OptionsType;

  /**
   * The root directory of Pinefile.
   */
  root: string;

  /**
   * Packages to preload before Pinefile is loaded.
   */
  require: string[];

  /**
   * Task name of the function that is executing.
   */
  task: string;
}
```

## getConfig

You can always get the current configuration with `getConfig` function:

```js
const { getConfig } = require('@pinefile/pine');

module.exports = {
  config: () => {
    const config = getConfig();
    console.log(config);
  },
};
```
