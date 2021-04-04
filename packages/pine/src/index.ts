import 'core-js/stable';

// core
export { configure, getConfig } from './config';
export * as log from './logger';
export { runCLI } from './cli';
export { parallel, series } from './task';

// plugins
export * from './plugins/file';
export * from './plugins/shell';
export { color } from './logger';
