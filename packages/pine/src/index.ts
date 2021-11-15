import 'core-js/stable';
import { runCLI } from './cli';
import { loadPineFile } from './file';
import { resolveTask, runTask } from './task';
import { createRunner } from './runner';

// api functions
const api = { runCLI, resolveTask, runTask, createRunner, loadPineFile };
export { api };

// typescript types
export { Arguments, Options } from './args';
export { PineFile, PineFileInfo } from './file';
export { Runner, RunnerOptions } from './runner';

// core functions
export { filterArgs, getArgs } from './args';
export { color } from './color';
export { configure, getConfig, Config, ConfigFunction } from './config';
export { createLogger, Logger, LoggerOptions } from './logger';
export { shell, run, ShellOptions } from './shell';

// plugin functions.
export * from './plugins/log';
export * from './plugins/task';
