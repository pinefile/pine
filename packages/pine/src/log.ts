import chalk from 'chalk';
import format from 'date-fns/format';

export const prefixes = {
  wait: chalk.cyan('wait') + ':  ',
  error: chalk.red('error') + ': ',
  warn: chalk.yellow('warn') + ':  ',
  ready: chalk.green('ready') + ': ',
  info: chalk.cyan('info') + ':  ',
  event: chalk.magenta('event') + ': ',
};

const formatDate = (date:Date) => chalk.gray(format(date, '[kk:mm:ss]'))
const newDate = () => new Date();

export const log = (...message: string[]) => {
  const date = formatDate(newDate())
  console.log(date, ...message);
}

export const warn = (...message: string[]) => {
  const date = formatDate(newDate())
  console.warn(date, ...message);
}

export const error = (...message: string[]) => {
  const date = formatDate(newDate())
  console.error(date, ...message);
}

export const color = chalk;
