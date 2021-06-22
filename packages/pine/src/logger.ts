import chalk, { Chalk } from 'chalk';
import { newDate, formatDate } from '@pinefile/utils';
import { ArgumentsType } from './args';
import { getConfig } from './config';

export let color: Chalk = chalk;
export const setup = (args: ArgumentsType) => {
  color = new chalk.Instance({ level: args.noColor ? 0 : 1 });
};

export type LogType = 'error' | 'warn' | 'info';
export type LogLevelType = LogType | 'silent';

const LogLevels: Record<LogLevelType, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

const output = (
  type: LogLevelType,
  message: Array<string | Error>,
  options: Partial<LoggerOptionsType> = {}
) => {
  const logLevel = (
    process.env.LOG_LEVEL ||
    getConfig().logLevel ||
    ''
  ).toLowerCase() as LogLevelType;

  if (LogLevels[logLevel] >= LogLevels[type]) {
    const date = formatDate(newDate());
    const method = type === 'info' ? 'log' : type;

    const args = [date, options.prefix && options.prefix, ...message].filter(
      Boolean
    );

    console[method].apply(null, args);
  }
};

export const timeInSecs = (time: number) => {
  const milliseconds = String((time % 1000) / 100)
    .split('.')
    .pop();
  const seconds = Math.floor((time / 1000) % 60);

  return `${seconds}.${milliseconds}s`;
};

export type LoggerOptionsType = {
  prefix: string;
};
class Logger {
  private options: LoggerOptionsType;

  constructor(options: Partial<LoggerOptionsType> = {}) {
    this.options = {
      prefix: '',
      ...options,
    };
  }

  info(...message: Array<string | Error>) {
    output('info', message, this.options);
  }

  warn(...message: Array<string | Error>) {
    output('warn', message, this.options);
  }

  error(...message: Array<string | Error>) {
    output('error', message, this.options);
  }
}

export const createLogger = (options: Partial<LoggerOptionsType> = {}) => {
  return new Logger(options);
};

export const log = createLogger();
