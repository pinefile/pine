import fs from 'fs';

describe('pine', () => {
  const log = console.log;
  let run;

  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
    run = require('../src').run;
  });

  afterEach(() => {
    console.log = log;
  });

  it('should run basic pinefile', () => {
    run([`--file=${__dirname}/fixtures/pinefile.basic.js`, 'build']);
    expect(console.log).toHaveBeenCalledWith('Building...');
  });

  it('should run pinefile with before tasks', () => {
    run(['build', `--file=${__dirname}/fixtures/pinefile.before.js`]);
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledWith('Write...');
    expect(console.log).toHaveBeenCalledWith('Building...');
  });

  it('should run pinefile with before tasks with array', () => {
    run(['array', `--file=${__dirname}/fixtures/pinefile.before.js`]);
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledWith('Array...');
  });

  it('should run pinefile with after tasks', () => {
    run(['build', `--file=${__dirname}/fixtures/pinefile.after.js`]);
    expect(console.log).toHaveBeenCalledWith('Building...');
    expect(console.log).toHaveBeenCalledWith('Compiling...');
    expect(console.log).toHaveBeenCalledWith('Write...');
  });

  it('should run pinefile with after tasks with array', () => {
    run(['array', `--file=${__dirname}/fixtures/pinefile.after.js`]);
    expect(console.log).toHaveBeenCalledWith('Array...');
    expect(console.log).toHaveBeenCalledWith('Compiling...');
  });

  it('should run pinefile with core plugins', () => {
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
          run([
            'writeJSON',
            `--file=${__dirname}/fixtures/pinefile.plugins.core.js`,
          ]);
          expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
          fs.unlinkSync('test.json');
          spy.mockReset();
          spy.mockRestore();
        },
      },
    ];

    tests.forEach((test) => {
      if (test.run) {
        test.run();
      } else {
        run([
          test.task,
          `--file=${__dirname}/fixtures/pinefile.plugins.core.js`,
        ]);
        test.test();
      }
    });
  });

  it('should run pinefile with with custom plugins', () => {
    const tests = [
      {
        task: 'echo',
        file: 'custom',
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
      run([
        test.task,
        `--file=${__dirname}/fixtures/pinefile.plugins.${test.file}.js`,
      ]);
      test.test();
    });
  });
});
