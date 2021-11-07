import { parsePineFile } from '../src/file';

describe('file', () => {
  test('should parse pinefile object', () => {
    const tasks = parsePineFile({
      a: {
        b: true,
        'b:c': true,
      },
      d: {
        'e:f': true,
      },
      g: true,
      h: {
        i: true,
      },
      j: {
        _: true,
      },
    });

    const tests = [
      {
        input: 'a:b',
        output: {
          _: true,
          c: {
            _: true,
          },
        },
      },
      {
        input: 'a:b:c',
        output: {
          _: true,
        },
      },
      {
        input: 'd:e:f',
        output: {
          _: true,
        },
      },
      {
        input: 'g',
        output: {
          _: true,
        },
      },
      {
        input: 'h:i',
        output: {
          _: true,
        },
      },
      {
        input: 'j',
        output: {
          _: true,
        },
      },
      {
        input: 'z',
        output: false,
      },
      {
        input: 'k:l',
        output: false,
      },
    ];

    tests.forEach((test) => {
      const output = test.input
        .split(':')
        .reduce((prev: any[], cur: string) => {
          return prev[cur] || false;
        }, tasks as any);

      expect(output as any).toEqual(test.output);
    });
  });

  test('should parse pinefile function', () => {
    const task = parsePineFile(() => {});

    expect(typeof task.default._).toBe('function');
  });
});
