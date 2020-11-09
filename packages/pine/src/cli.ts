import yargs from 'yargs';
import { runFile } from './';

export const runCLI = (argv: Array<any>) => {
  const args = yargs
    .options({
      help: { type: 'boolean', default: false, desc: 'Show help' },
      file: {
        type: 'string',
        default: '',
        desc: 'Path to Pipefile or pipefile.js',
      },
      silent: {
        type: 'boolean',
        default: false,
        desc: 'Runs the task in silent mode',
      },
    })
    .parse(argv);

  return runFile(args);
};
