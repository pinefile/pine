const Pine = require('../src/index').default;

describe('pine', () => {
  it('should run pinefile', () => {
    console.log = jest.fn();
    const pine = new Pine();
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.js`]);
    expect((console.log as any).mock.calls[0][0]).toBe('Building...');
  });

  it('should run pinefile with echo plugin', () => {
    console.log = jest.fn();
    const pine = new Pine();
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.echo.js`]);
    expect((console.log as any).mock.calls[0][0]).toBe('Building...');
  });
});
