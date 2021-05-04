import { configure } from '../dist';
import { api } from '../src';
import { parsePineFile } from '../src/file';
import pinefile from './fixtures/pinefile.runner';

describe('pine', () => {
  Object.keys(pinefile).forEach((task) => {
    test(`should run custom runner: ${task}`, async () => {
      const spy = jest.spyOn(console, 'log');
      await api.runCLI([
        task,
        `--file=${__dirname}/fixtures/pinefile.runner.js`,
      ]);
      expect(spy.mock.calls[0][1].indexOf(`Starting '${task}'`)).toBeTruthy();
      expect(spy.mock.calls[1][0]).toBe(task);
      expect(spy.mock.calls[2][1].indexOf(`Finished '${task}'`)).toBeTruthy();
      spy.mockRestore();
    });
  });

  test('should run custom global runner', async () => {
    const obj = parsePineFile({
      test: () => console.log('test'),
    });

    configure({
      runner: async (pinefile: any, name: string, argv: any) => {
        return async () => {
          expect(typeof pinefile.test._).toBe('function');
          expect(name).toBe('test');
          expect(argv).toBe({});
        };
      },
    });

    api.runTask(obj, 'test');
  });
});
