import { findFile } from '../file';

/**
 * Get closest `package.json` object.
 *
 * @return {object}
 */
export const pkg = (): any => {
  return require(findFile('package.json'));
};
