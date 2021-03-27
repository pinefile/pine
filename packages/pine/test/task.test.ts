const { parallel, series } = require('../src');
const pinefile = require('./fixtures/pinefile.tasks');

jest.setTimeout(10000);

let spyLog: any = null;

describe('task', () => {
  beforeEach(() => {
    spyLog = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    spyLog.mockRestore();
  });

  test('should run pinefile with series of tasks', async (done) => {
    const plugin = series('s1', 's2');
    const task = plugin(pinefile, '');

    await task(() => {
      done();
      expect(spyLog).toHaveBeenCalledWith('Cleaning...');
      expect(spyLog).toHaveBeenCalledWith('Building...');
    });
  });

  test('should run pinefile with parallel of tasks', async (done) => {
    const plugin = parallel('p1', 'p2');
    const task = plugin(pinefile, '');

    await task(() => {
      done();
      expect(spyLog).toHaveBeenCalledWith('Building...');
      expect(spyLog).toHaveBeenCalledWith('Cleaning...');
    });
  });
});
