import chalk from 'chalk';
import format from 'date-fns/format';

const isSilent = (): boolean => isLogLevel('silent');
const isLogLevel = (s: string): boolean =>
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

export const log = (...message: string[]) => {
  if (isSilent()) {
    return;
  }

  const date = formatDate(newDate());
  console.log(date, ...message);
};

export const warn = (...message: string[]) => {
  if (isSilent()) {
    return;
  }

  const date = formatDate(newDate());
  console.warn(date, ...message);
};

export const error = (...message: string[]) => {
  if (isSilent()) {
    return;
  }

  const date = formatDate(newDate());
  console.error(date, ...message);
};

export const color = chalk;
