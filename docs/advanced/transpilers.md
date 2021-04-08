# Transpilers

Example of how to use Babel transpiler for your `pinefile.js`

```json
{
  "pine": {
    "require": ["@babel/register"]
  },
  "babel": {
    "presets": ["env"]
  },
  "devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "@babel/register": "^7.12.1"
  }
}
```

Example of how to use TypeScript transpiler for your `pinefile.ts`

```json
{
  "pine": {
    "require": ["ts-node/register"]
  },
  "devDependencies": {
    "ts-node": "^9.0.0",
    "typescript": "^4.0.5"
  }
}
```

Example of how to use esbuild transpiler for your `pinefile.[j|t]s`

```json
{
  "pine": {
    "require": ["esbuild-register"]
  },
  "devDependencies": {
    "esbuild-register": "^2.3.0"
  }
}
```
