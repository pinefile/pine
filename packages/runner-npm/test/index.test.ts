import { configure } from '@pinefile/pine';
import runner from '../src';

describe('runner-npm', () => {
  test('should run runner', async () => {
    configure({
      root: `${__dirname}/..`,
    });

    const obj = {
      test: {
        _: () => console.log('test'),
      },
    };

    await runner(obj, 'test', {});
  });
});
