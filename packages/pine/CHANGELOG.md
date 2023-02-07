# @pinefile/pine

## 2.0.3

### Patch Changes

- [#284](https://github.com/pinefile/pine/pull/284) [`e62aed2`](https://github.com/pinefile/pine/commit/e62aed2958897bd34743a7c97ce958ae2067579f) Thanks [@frozzare](https://github.com/frozzare)! - Bump dependencies

- Updated dependencies [[`e62aed2`](https://github.com/pinefile/pine/commit/e62aed2958897bd34743a7c97ce958ae2067579f)]:
  - @pinefile/utils@2.0.1

## 2.0.2

### Patch Changes

- [#167](https://github.com/pinefile/pine/pull/167) [`b0e4047`](https://github.com/pinefile/pine/commit/b0e4047cce8a64c1df4720bceafb438f7745184e) Thanks [@frozzare](https://github.com/frozzare)! - Fix so config can be loaded from package.json

## 2.0.1

### Patch Changes

- [#163](https://github.com/pinefile/pine/pull/163) [`a5e9b03`](https://github.com/pinefile/pine/commit/a5e9b0319d13abce2f0688c32ecece215269261d) Thanks [@frozzare](https://github.com/frozzare)! - Fix bin file for pine

## 2.0.0

### Major Changes

- [#157](https://github.com/pinefile/pine/pull/157) [`13fb795`](https://github.com/pinefile/pine/commit/13fb795dbbd114d305fc397582d364d32b882fbe) Thanks [@frozzare](https://github.com/frozzare)!
  - Add `esbuild-register` by default
  - Add `tasks` function to easier load all tasks in a directory
  - Add export for `glob`
  - Bump dependencies
  - Drop support for node 12

### Patch Changes

- Updated dependencies [[`a238930`](https://github.com/pinefile/pine/commit/a2389300a3a08278f457cf616f784d288da54f8d)]:
  - @pinefile/utils@2.0.0

## 1.6.2

### Patch Changes

- [`2ab1897`](https://github.com/pinefile/pine/commit/2ab1897c085d57746a7a99bf5a80ee34a385c14d) Thanks [@frozzare](https://github.com/frozzare)! - Fix order of how global pinefile is loaded

## 1.6.1

### Patch Changes

- [`3257182`](https://github.com/pinefile/pine/commit/32571820ba1aa22f589bbc81d8d98c8a9920e0b4) Thanks [@frozzare](https://github.com/frozzare)! - Fix issue where help text could not be displayed when no pinefile was loaded

## 1.6.0

### Minor Changes

- [#29](https://github.com/pinefile/pine/pull/29) [`2b0d7a6`](https://github.com/pinefile/pine/commit/2b0d7a6ba3a5a3a22dbab9ff86100427dc3f81ac) Thanks [@frozzare](https://github.com/frozzare)!
- Add support for global Pinefiles
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
