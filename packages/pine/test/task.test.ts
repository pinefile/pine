const { parallel, series } = require('../src');
const pinefile = require('./fixtures/pinefile.tasks');

jest.setTimeout(10000);

describe('task', () => {
  test('should run pinefile with series of tasks', async (done) => {
    const spy = jest.spyOn(console, 'log');
    const plugin = series('s1', 's2');
    const task = plugin(pinefile, '');

    await task(() => {
      done();
      expect(spy).toHaveBeenCalledWith('Cleaning...');
      expect(spy).toHaveBeenCalledWith('Building...');
      spy.mockRestore();
    });
  });

  test('should run pinefile with parallel of tasks', async (done) => {
    const spy = jest.spyOn(console, 'log');
    const plugin = parallel('p1', 'p2');
    const task = plugin(pinefile, '');

    await task(() => {
      done();
      expect(spy).toHaveBeenCalledWith('Building...');
      expect(spy).toHaveBeenCalledWith('Cleaning...');
      spy.mockRestore();
    });
  });
});
