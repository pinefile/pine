import 'core-js/stable';

// core
export { runCLI } from './cli';
export { runTask } from './task';

// plugins
export { configure, getConfig } from './config';
export { log, color, createLogger, LoggerOptions } from './logger';
export { parallel, series } from './task';
export * from './plugins/shell';
