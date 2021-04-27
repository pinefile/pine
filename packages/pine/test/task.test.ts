const { parallel, series } = require('../src');
const { resolveTask, runTask, validTaskValue } = require('../src/task');
const { parsePineFile } = require('../src/file');
const pinefile = require('./fixtures/pinefile.tasks');

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
    const task = plugin(parsePineFile(pinefile), '');

    await task(() => {
      done();
      expect(spyLog).toHaveBeenCalledWith('Cleaning...');
      expect(spyLog).toHaveBeenCalledWith('Building...');
    });
  });

  test('should run series of functions', async (done) => {
    const output: string[] = [];
    const tasks = [
      (ok: any) => {
        output.push('echo one');
        ok();
      },
      (ok: any) => {
        output.push('echo two');
        ok();
      },
    ];

    await series(tasks);

    done();
    expect(output).toEqual(['echo one', 'echo two']);
  });

  test('should run series of async functions', async (done) => {
    const output: string[] = [];
    const tasks = [
      async () => {
        await delay(100);
        output.push('echo one');
      },
      async () => {
        await delay(100);
        output.push('echo two');
      },
    ];

    await series(tasks);

    done();
    expect(output).toEqual(['echo one', 'echo two']);
  });

  test('should run pinefile with parallel of tasks', async (done) => {
    const plugin = parallel('p1', 'p2');
    const task = plugin(parsePineFile(pinefile), '');

    await task(() => {
      done();
      expect(spyLog).toHaveBeenCalledWith('Building...');
      expect(spyLog).toHaveBeenCalledWith('Cleaning...');
    });
  });

  test('should run parallel of functions', async (done) => {
    const output: string[] = [];
    const tasks = [
      (ok: any) => {
        setTimeout(() => {
          output.push('echo one');
          ok();
        }, 500);
      },
      (ok: any) => {
        output.push('echo two');
        ok();
      },
    ];

    await parallel(tasks);

    done();
    expect(output).toEqual(['echo two', 'echo one']);
  });

  test('should run parallel of async functions', async (done) => {
    const output: string[] = [];
    const tasks = [
      async () => {
        await delay(1500);
        output.push('echo one');
      },
      async () => {
        await delay(100);
        output.push('echo two');
      },
    ];

    await parallel(tasks);

    done();
    expect(output).toEqual(['echo two', 'echo one']);
  });

  test('should resolve task', () => {
    const tasks = parsePineFile({
      a: {
        b: () => true,
        'b:c': () => true,
      },
      d: {
        'e:f': () => true,
      },
      g: () => true,
      h: {
        i: () => true,
      },
      j: {
        _: () => true,
      },
    });

    const tests = [
      {
        input: 'a:b',
        type: 'function',
        output: true,
      },
      {
        input: 'a:b:c',
        type: 'function',
        output: true,
      },
      {
        input: 'd:e:f',
        type: 'function',
        output: true,
      },
      {
        input: 'g',
        type: 'function',
        output: true,
      },
      {
        input: 'h:i',
        type: 'function',
        output: true,
      },
      {
        input: 'j',
        type: 'function',
        output: true,
      },
      {
        input: 'z',
        type: 'boolean',
        output: false,
      },
      {
        input: 'k:l',
        type: 'boolean',
        output: false,
      },
    ];

    tests.forEach((test) => {
      const output = resolveTask(test.input, tasks);
      expect(typeof output).toBe(test.type);
      expect(output ? output() : output).toBe(test.output);
    });
  });

  test('should validate task value', () => {
    const tests = [
      {
        input: () => {},
        output: true,
      },
      {
        input: {
          _: () => {},
        },
        output: true,
      },
      {
        input: {
          _: undefined,
        },
        output: true,
      },
      {
        input: {},
        output: false,
      },
      {
        input: {
          _: null,
        },
        output: false,
      },
      {
        input: {
          _: false,
        },
        output: false,
      },
      {
        input: {
          _: true,
        },
        output: false,
      },
      {
        input: {
          _: 1,
        },
        output: false,
      },
      {
        input: {
          _: '',
        },
        output: false,
      },
      {
        input: true,
        output: false,
      },
      {
        input: false,
        output: false,
      },
      {
        input: null,
        output: false,
      },
      {
        input: undefined,
        output: false,
      },
      {
        input: 1,
        output: false,
      },
      {
        input: '',
        output: false,
      },
    ];

    tests.forEach((test) => {
      expect(validTaskValue(test.input)).toEqual(test.output);
    });
  });

  test('should throw error if task function is not function', async () => {
    const fn = () => null;
    const obj = {
      foo: null,
      fn: fn(),
    };

    for (const key of Object.keys(obj)) {
      try {
        await runTask(obj, key, []);
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    }
  });
});
