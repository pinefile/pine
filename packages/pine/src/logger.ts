import chalk, { Chalk } from 'chalk';
import format from 'date-fns/format';
import { Arguments } from './args';
import { getConfig } from './config';

export let color: Chalk = chalk;
export const setup = (args: Arguments) => {
  color = new chalk.Instance({ level: args.noColor ? 0 : 1 });
};

const formatDate = (date: Date) => chalk.gray(format(date, '[kk:mm:ss]'));
const newDate = () => new Date();

export type Log = 'error' | 'warn' | 'info';
export type LogLevel = Log | 'silent';

const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

const output = (
  type: LogLevel,
  message: Array<string | Error>,
  options: Partial<LoggerOptions> = {}
) => {
  const logLevel = (
    process.env.LOG_LEVEL ||
    getConfig().logLevel ||
    ''
  ).toLowerCase() as LogLevel;

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

export type LoggerOptions = {
  prefix: string;
};
class Logger {
  private options: LoggerOptions;

  constructor(options: Partial<LoggerOptions> = {}) {
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

export const createLogger = (options: Partial<LoggerOptions> = {}) => {
  return new Logger(options);
};

export const log = createLogger();
