import chalk from 'chalk';

export const prefixes = {
  wait: chalk.cyan('wait') + ':  ',
  error: chalk.red('error') + ': ',
  warn: chalk.yellow('warn') + ':  ',
  ready: chalk.green('ready') + ': ',
  info: chalk.cyan('info') + ':  ',
  event: chalk.magenta('event') + ': ',
};

export const color = chalk;

export const wait = (...message: string[]) => {
  console.log(prefixes.wait, ...message);
};

export const error = (...message: string[]) => {
  console.error(prefixes.error, ...message);
};

export const warn = (...message: string[]) => {
  console.warn(prefixes.warn, ...message);
};

export const ready = (...message: string[]) => {
  console.log(prefixes.ready, ...message);
};

export const info = (...message: string[]) => {
  console.log(prefixes.info, ...message);
};

export const event = (...message: string[]) => {
  console.log(prefixes.event, ...message);
};
