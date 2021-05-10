import 'core-js/stable';
import { runCLI } from './cli';
import { resolveTask, runTask } from './task';

// core
const api = { runCLI, resolveTask, runTask };
export { api };

// types
export { ArgumentsType, OptionsType } from './args';
export { PineFileType } from './file';
export { RunnerType } from './runner';

// functions
export { getArgs } from './args';
export { configure, getConfig } from './config';
export { log, color, createLogger, LoggerOptions } from './logger';
export * from './plugins/task';
export * from './plugins/shell';
