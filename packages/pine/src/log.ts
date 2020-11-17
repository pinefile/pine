import chalk from 'chalk';
import format from 'date-fns/format';

export const isSilent = (): boolean => isLogLevel('silent');
export const isLogLevel = (s: string): boolean =>
  (process.env.LOG_LEVEL || '').toLowerCase() === s;

export const prefixes = {
  wait: chalk.cyan('wait') + ':  ',
  error: chalk.red('error') + ': ',
  warn: chalk.yellow('warn') + ':  ',
  ready: chalk.green('ready') + ': ',
  info: chalk.cyan('info') + ':  ',
  event: chalk.magenta('event') + ': ',
};

const formatDate = (date: Date) => chalk.gray(format(date, '[kk:mm:ss]'));
const newDate = () => new Date();

export const info = (...message: string[]) => {
  const date = formatDate(newDate());
  console.log(date, ...message);
};

export const warn = (...message: string[]) => {
  const date = formatDate(newDate());
  console.warn(date, ...message);
};

export const error = (...message: string[]) => {
  const date = formatDate(newDate());
  console.error(date, ...message);
};

export const color = chalk;
