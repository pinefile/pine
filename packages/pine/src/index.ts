import 'core-js/stable';

// core
export { option } from './args';
export * as log from './logger';
export { runCLI } from './cli';
export { parallel, series } from './task';

// plugins
export * from './plugins/file';
export * from './plugins/shell';
