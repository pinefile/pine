# custom executable

You can use create executable and use Pine under the hood. To make it work you need to push the file flag to `argv` array so Pine knows where to load your `pinefile.js` from.

```js
#!/usr/bin/env node

const { runCLI } = require('@pinefile/pine');
const argv = process.argv.slice(2);

argv.push(`--file=${__dirname}/pinefile.js`);

runCLI(argv);
```
