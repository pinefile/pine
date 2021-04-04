import chalk from 'chalk';
import format from 'date-fns/format';
import { getConfig } from './config';

const formatDate = (date: Date) => chalk.gray(format(date, '[kk:mm:ss]'));
const newDate = () => new Date();

// const prefixes = {
//   error: chalk.red('error') + ': ',
//   warn: chalk.yellow('warn') + ':  ',
//   info: chalk.cyan('info') + ':  ',
// };

export const color = chalk;
export type LogType = 'error' | 'warn' | 'info';
export type LogLevel = LogType | 'silent';

const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

const output = (type: LogLevel, ...message: Array<string | Error>) => {
  const logLevel = (
    process.env.LOG_LEVEL ||
    getConfig().logLevel ||
    ''
  ).toLowerCase() as LogLevel;

  if (LogLevels[logLevel] >= LogLevels[type]) {
    const date = formatDate(newDate());
    const method = type === 'info' ? 'log' : type;
    console[method](date, ...message);
  }
};

export const timeInSecs = (time: number) => {
  const milliseconds = String((time % 1000) / 100)
    .split('.')
    .pop();
  const seconds = Math.floor((time / 1000) % 60);

  return `${seconds}.${milliseconds}s`;
};

export const info = (...message: Array<string | Error>) =>
  output('info', ...message);

export const warn = (...message: Array<string | Error>) =>
  output('warn', ...message);

export const error = (...message: Array<string | Error>) =>
  output('error', ...message);
