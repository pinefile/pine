import fs from 'fs';
import Pine from '../src';

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

  it('should run pinefile with after tasks', () => {
    const pine = new Pine();
    pine.run(['build', `--file=${__dirname}/fixtures/pinefile.after.js`]);
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledWith('Write...');
    expect(console.log).toHaveBeenCalledTimes(3);
  });

  it('should run pinefile with after tasks with array', () => {
    const pine = new Pine();
    pine.run(['array', `--file=${__dirname}/fixtures/pinefile.after.js`]);
    expect(console.log).toHaveBeenCalledWith('Array...');
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it('should run pinefile with core plugins', () => {
    const pine = new Pine();
    const logTimes = 2;
    const tests = [
      {
        task: 'pkg',
        test: () => {
          expect(console.log).toHaveBeenCalledWith('pkg: 1.0.0');
        },
      },
      {
        task: 'readJSON',
        test: () => {
          expect(console.log).toHaveBeenCalledWith('readJSON: 1.0.0');
        },
      },
      {
        task: 'writeJSON',
        run: () => {
          const spy = jest.spyOn(fs, 'writeFileSync');
          pine.run([
            'writeJSON',
            `--file=${__dirname}/fixtures/pinefile.plugins.core.js`,
          ]);
          expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
          spy.mockReset();
          spy.mockRestore();
        },
      },
    ];

    tests.forEach((test) => {
      if (test.run) {
        test.run();
      } else {
        pine.run([
          test.task,
          `--file=${__dirname}/fixtures/pinefile.plugins.core.js`,
        ]);
        test.test();
      }
    });

    expect(console.log).toHaveBeenCalledTimes(logTimes);
  });

  it('should run pinefile with with custom plugins', () => {
    const pine = new Pine();
    const logTimes = 3;
    const tests = [
      {
        task: 'echo',
        file: 'custom',
        test: () => {
          expect(console.log).toHaveBeenCalledWith('Echo...');
        },
      },
      {
        task: 'echo',
        file: 'object',
        test: () => {
          expect(console.log).toHaveBeenCalledWith('Echo...');
        },
      },
      {
        task: 'test',
        file: 'custom',
        test: () => {
          expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('Testing...')
          );
        },
      },
    ];

    tests.forEach((test) => {
      pine.run([
        test.task,
        `--file=${__dirname}/fixtures/pinefile.plugins.${test.file}.js`,
      ]);
      test.test();
    });

    expect(console.log).toHaveBeenCalledTimes(logTimes);
  });
});
