import 'core-js/stable';
import { runCLI } from './cli';
import { resolveTask, runTask } from './task';
import { createRunner } from './runner';

// core
const api = { runCLI, resolveTask, runTask, createRunner };
export { api };

// types
export { Arguments, Options } from './args';
export { PineFile } from './file';
export { Runner, RunnerOptions } from './runner';

// functions
export { filterArgs, getArgs } from './args';
export { configure, getConfig, Config, ConfigFunction } from './config';
export { log, color, createLogger, LoggerOptions } from './logger';
export * from './plugins/task';
export { shell, run, ShellOptions } from './plugins/shell';
