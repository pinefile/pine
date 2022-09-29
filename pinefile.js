import { log, run, getConfig, tasks } from './packages/pine/src/index.ts';
import { execRun } from './packages/monorepo/src/index.ts';

export default {
  build: async () => {
    await run`npm run build`;
  },
  config: () => {
    const config = getConfig();
    log.info(config);
  },
  test: async (argv) => {
    await run`jest ${argv._.join(' ')}`;
  },
  tsc: async () => {
    await execRun`tsc`;
  },
};
