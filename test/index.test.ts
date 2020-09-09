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
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.basic.js`]);
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

  it('should run pinefile with echo plugin', () => {
    const pine = new Pine();
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.echo.js`]);
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
