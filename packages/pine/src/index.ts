import 'core-js/stable';
import { runCLI } from './cli';
import { runTask } from './task';

// core
const api = { runCLI, runTask };
export { api };

// plugins
export { configure, getConfig } from './config';
export { log, color, createLogger, LoggerOptions } from './logger';
export { parallel, series } from './task';
export * from './plugins/shell';
