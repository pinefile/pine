import 'core-js/stable';

// core
export { option } from './args';
export * as log from './log';
export { runCLI } from './cli';
export * from './task';

// plugins
export * from './plugins/file';
export * from './plugins/shell';
