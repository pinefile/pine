import { runCLI } from '../src';
import pinefile from './fixtures/pinefile.runner';

describe('pine', () => {
  let run: any = null;

  beforeEach(() => {
    run = runCLI;
  });

  afterEach(() => {
    process.env.LOG_LEVEL = '';
  });

  Object.keys(pinefile).forEach((task) => {
    test(`should run custom runner: ${task}`, async () => {
      const spy = jest.spyOn(console, 'log');
      await run([task, `--file=${__dirname}/fixtures/pinefile.runner.js`]);
      expect(spy.mock.calls[0][1].indexOf(`Starting '${task}'`)).toBeTruthy();
      expect(spy.mock.calls[1][0]).toBe(task);
      expect(spy.mock.calls[2][1].indexOf(`Finished '${task}'`)).toBeTruthy();
      spy.mockRestore();
    });
  });
});
