import { run } from '@pinefile/pine';

export default {
  build: () => {
    console.log('Building...');
  },
  test: async () => {
    await run('jest');
  },
};
