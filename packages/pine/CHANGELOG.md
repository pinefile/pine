# @pinefile/pine

## 1.6.0

### Minor Changes

- [#29](https://github.com/pinefile/pine/pull/29) [`2b0d7a6`](https://github.com/pinefile/pine/commit/2b0d7a6ba3a5a3a22dbab9ff86100427dc3f81ac) Thanks [@frozzare](https://github.com/frozzare)! - \* Add support for global Pinefiles
  - Fix issue with `--file` flag where some Pinefiles couldn't be loaded right.

## 1.5.1

### Patch Changes

- [#27](https://github.com/pinefile/pine/pull/27) [`914e401`](https://github.com/pinefile/pine/commit/914e4011f727edd2d32c0062b5156306e1ce4a17) Thanks [@frozzare](https://github.com/frozzare)! - Bump dependencies and fix multimatch version

## 1.5.0

### Minor Changes

- [#18](https://github.com/pinefile/pine/pull/18) [`fc6ad61`](https://github.com/pinefile/pine/commit/fc6ad61b071c48cbbb275a066cd1a5e31c6fba26) Thanks [@frozzare](https://github.com/frozzare)! - Bump dependencies

## 1.4.1

### Patch Changes

- [#16](https://github.com/pinefile/pine/pull/16) [`cc50176`](https://github.com/pinefile/pine/commit/cc50176e91adb5bf0af881854ca7453eda22f177) Thanks [@frozzare](https://github.com/frozzare)! - Fix configure in cli to be runned before load of pinefile

## 1.4.0

### Minor Changes

- [#10](https://github.com/pinefile/pine/pull/10) [`ae94431`](https://github.com/pinefile/pine/commit/ae9443110f106cbdd235b9589af8baa9fc55e4cf) Thanks [@frozzare](https://github.com/frozzare)! - Add support for this keyword in task functions

## 1.3.0

### Minor Changes

- [`9632e1a`](https://github.com/pinefile/pine/commit/9632e1aca9199b356faa1981acda039661c7e85b) Thanks [@frozzare](https://github.com/frozzare)!

- Support function in default export, e.g `module.exports = () => {}`
- Export `loadPineFile` function as an api-function

## 1.2.0

### Minor Changes

- [`54bf901`](https://github.com/pinefile/pine/commit/54bf901dda9951cf306ac9fc9239522aee37bc10) Thanks [@frozzare](https://github.com/frozzare)!

- Fixed `--log-level` flag crash bug
- Added `--quiet` flag
- Added flag aliases to some flags
- Setting log level now will only affect internal logger and not the one you require from `@pinefile/pine`

### Patch Changes

- Updated dependencies [[`54bf901`](https://github.com/pinefile/pine/commit/54bf901dda9951cf306ac9fc9239522aee37bc10)]:
  - @pinefile/utils@1.2.0

## 1.1.0

### Minor Changes

- [`b906779`](https://github.com/pinefile/pine/commit/b906779eb4a67bd3859099493734f4dad8052d5b) Thanks [@frozzare](https://github.com/frozzare)! - Bump versions to follow semver

### Patch Changes

- Updated dependencies [[`b906779`](https://github.com/pinefile/pine/commit/b906779eb4a67bd3859099493734f4dad8052d5b)]:
  - @pinefile/utils@1.1.0

## 1.0.2

### Patch Changes

- Updated dependencies []:
  - @pinefile/utils@1.0.2
