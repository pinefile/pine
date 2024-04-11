import format from 'date-fns/format';
import { color } from './color';
import { getConfig } from './config';

const formatDate = (date: Date) => color.gray(format(date, '[kk:mm:ss]'));
const newDate = () => new Date();

export type Log = 'error' | 'warn' | 'info';
export type LogLevel = Log | 'silent';

export type LoggerOptions = {
  prefix: string;
  logLevel?: LogLevel;
};

const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

const output = (
  type: LogLevel,
  message: Array<string | Error>,
  options: Partial<LoggerOptions> = {},
) => {
  const prefix = options.prefix || `[${getConfig().task}]`;
  const logLevel = options.logLevel
    ? options.logLevel
    : ((
        process.env.LOG_LEVEL ||
        getConfig().logLevel ||
        ''
      ).toLowerCase() as LogLevel);

  if (LogLevels[logLevel] >= LogLevels[type]) {
    const date = formatDate(newDate());
    const method = type === 'info' ? 'log' : type;

    const args = [date, prefix, ...message].filter(Boolean);

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

export class Logger {
  private options: LoggerOptions;

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = { prefix: '', ...options };
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

export const createLogger = (options: Partial<LoggerOptions> = {}): Logger =>
  new Logger(options);

let _internalLogger: Logger = createLogger();

export const internalLog = () => _internalLogger;
export const setLogger = (logger?: Logger): Logger =>
  (_internalLogger = logger || _internalLogger || createLogger());
