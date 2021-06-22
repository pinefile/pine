import chalk from 'chalk';
import format from 'date-fns/format';

export const newDate = () => new Date();
export const formatDate = (date: Date) =>
  chalk.gray(format(date, '[kk:mm:ss]'));
