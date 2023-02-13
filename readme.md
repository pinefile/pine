<div align="center">
  <a href="https://github.com/pinefile/pine">
    <img src="https://avatars.githubusercontent.com/u/70938295?s=200&v=4" width="100px" height="100px" />
  </a>
</div>

# Pine

[![Build Status](https://img.shields.io/github/actions/workflow/status/pinefile/pine/nodejs.yml?color=049668&style=flat-square)](https://github.com/pinefile/pine/actions) [![NPM](https://img.shields.io/npm/v/@pinefile/pine?color=049668&style=flat-square)](https://www.npmjs.com/package/@pinefile/pine)

Small JavaScript-based task runner for node.js.

## Docs

Read the documentation [here](https://pinefile.github.io/docs/)

## Basic usage

Create `pinefile.js` or `pinefile.ts`

```js
import { run } from '@pinefile/pine';

export default {
  build: () => {
    console.log('Building...');
  },
  test: async () => {
    await run('jest');
  },
};
```

Then run it! It is best to either place `pine` inside a npm run script or run it with `npx`:

```
npx pine build
```

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)
