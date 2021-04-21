import 'core-js/stable';

// core
export { runCLI } from './cli';

// plugins
export { configure, getConfig } from './config';
export { log, color, createLogger, LoggerOptions } from './logger';
export { parallel, series } from './task';
export * from './plugins/shell';
