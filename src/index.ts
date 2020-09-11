import Pine from './pine';

function help() {
  console.log(`Usage: pine <task>

Options:
  --help  Show help
  --file  Path to Pinefile`);
}

/**
 * Run tasks or show help.
 *
 * @param {array} argv
 */
export const run = (argv: Array<any>) => {
  if (argv.includes('--help')) {
    return help();
  }

  const pine = new Pine();
  return pine.run(argv);
}
