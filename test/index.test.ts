const Pine = require('../src/index').default;

describe('pine', () => {
  const log = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = log;
    jest.resetModules();
  });

  it('should run basic pinefile', () => {
    const pine = new Pine();
    pine.run([`--file=${__dirname}/fixtures/pinefile.basic.js`, 'build']);
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should run pinefile with before tasks', () => {
    const pine = new Pine();
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.before.js`]);
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledWith('Write...');
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledTimes(3);
  });

  it('should run pinefile with before tasks with array', () => {
    const pine = new Pine();
    pine.run(['array', `--file=${__dirname}/fixtures/pinefile.before.js`]);
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledWith('Array...');
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('should run pinefile with core plugins', () => {
    const pine = new Pine();
    pine.run([
      'build',
      `--file=${__dirname}/fixtures/pinefile.plugins.core.js`,
    ]);
    expect(console.log).toHaveBeenCalledWith('Building 1.0.0...');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should run pinefile with echo with plugin file', () => {
    const pine = new Pine();
    pine.run([
      'build',
      `--file=${__dirname}/fixtures/pinefile.plugins.custom.js`,
    ]);
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should run pinefile with echo with plugin object', () => {
    const pine = new Pine();
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.load.js`]);
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should run pinefile with npm plugin and test command', () => {
    const pine = new Pine();
    pine.run([
      'test',
      `--file=${__dirname}/fixtures/pinefile.plugins.custom.js`,
    ]);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Testing...')
    );
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
