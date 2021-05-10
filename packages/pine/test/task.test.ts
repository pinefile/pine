import { resolveTask, runTask, validTaskValue } from '../src/task';
import { parsePineFile } from '../src/file';

describe('task', () => {
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
      {
        input: undefined,
        type: 'boolean',
        output: false,
      },
    ];

    tests.forEach((test) => {
      const output = resolveTask(tasks, test.input as any);
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
