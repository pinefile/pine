import 'core-js/stable';
import { runCLI } from './cli';
import { resolveTask, runTask } from './task';
import { createRunner } from './runner';

// core
const api = { runCLI, resolveTask, runTask, createRunner };
export { api };

// types
export { ArgumentsType, OptionsType } from './args';
export { PineFileType } from './file';
export { RunnerType, RunnerOptionsType } from './runner';

// functions
export { getArgs } from './args';
export { configure, getConfig, ConfigType, ConfigFunctionType } from './config';
export { log, color, createLogger, LoggerOptionsType } from './logger';
export * from './plugins/task';
export { shell, run, ShellOptionsType } from './plugins/shell';
