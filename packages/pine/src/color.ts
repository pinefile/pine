import chalk, { Chalk } from 'chalk';
import { Arguments } from './args';

export let color: Chalk = chalk;
export const setupColor = (args: Arguments) => {
  color = new chalk.Instance({ level: args.noColor ? 0 : 1 });
};
