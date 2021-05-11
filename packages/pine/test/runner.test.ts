import { api, configure } from '../src';
import { parsePineFile } from '../src/file';
import pinefile from './fixtures/pinefile.runner';

describe('pine', () => {
  Object.keys(pinefile).forEach((task) => {
    test(`should run custom runner: ${task}`, async () => {
      const spy = jest.spyOn(console, 'log');
      await api.runCLI([
        task,
        `--file=${__dirname}/fixtures/pinefile.runner.js`,
      ]);
      expect(spy.mock.calls[0][1].indexOf(`Starting '${task}'`)).toBeTruthy();
      expect(spy.mock.calls[1][0]).toBe(task);
      expect(spy.mock.calls[2][1].indexOf(`Finished '${task}'`)).toBeTruthy();
      spy.mockRestore();
    });
  });

  test('should run custom global runner', async () => {
    const spy = jest.spyOn(console, 'log');
    let runner = false;

    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: async (pinefile: any, name: string, args: any) => {
        return async () => {
          expect(typeof pinefile.test._).toBe('function');
          expect(name).toBe('test');
          expect(args.name).toBe('test');
          const task = api.resolveTask(obj, name);
          runner = true;
          if (task) {
            await task(args);
          }
        };
      },
    });

    await api.runTask(obj, 'test', {
      name: 'test',
    });

    expect(spy.mock.calls[1][0]).toBe('test');
    expect(runner).toBe(true);

    spy.mockRestore();
  });

  test('should run custom global runner with default export', async () => {
    const spy = jest.spyOn(console, 'log');
    let runner = false;

    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: {
        default: async (pinefile: any, name: string, args: any) => {
          return async () => {
            expect(typeof pinefile.test._).toBe('function');
            expect(name).toBe('test');
            expect(args.name).toBe('test');
            const task = api.resolveTask(obj, name);
            runner = true;
            if (task) {
              await task(args);
            }
          };
        },
      },
    });

    await api.runTask(obj, 'test', {
      name: 'test',
    });

    expect(spy.mock.calls[1][0]).toBe('test');
    expect(runner).toBe(true);

    spy.mockRestore();
  });

  test('should run custom global runner from file', async () => {
    const spy = jest.spyOn(console, 'log');

    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: `${__dirname}/fixtures/files/runner.js`,
    });

    await api.runTask(obj, 'test', {
      name: 'test',
    });

    expect(spy.mock.calls[1][0]).toBe('test');
    spy.mockRestore();
  });

  test('should run custom global runner from file with default export', async () => {
    const spy = jest.spyOn(console, 'log');

    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: `${__dirname}/fixtures/files/runner-default.js`,
    });

    await api.runTask(obj, 'test', {
      name: 'test',
    });

    expect(spy.mock.calls[1][0]).toBe('test');
    spy.mockRestore();
  });

  test('should throw if string runner cannot be loaded', async () => {
    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: 'not a function',
    });

    try {
      await api.runTask(obj, 'test', {
        name: 'test',
      });
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err.message).toContain('Failed to load runner');
    }
  });

  test('should test runner with options', async () => {
    const spy = jest.spyOn(console, 'log');
    let runner = false;

    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    const fn = async (pinefile: any, name: string, args: any, options: any) => {
      return async () => {
        expect(typeof pinefile.test._).toBe('function');
        expect(name).toBe('test');
        expect(options.name).toBe('foo');
        const task = api.resolveTask(obj, name);
        runner = true;
        if (task) {
          await task({
            name: options.name,
          });
        }
      };
    };

    configure({
      runner: [
        fn,
        {
          name: 'foo',
        },
      ],
    });

    await api.runTask(obj, 'test');

    expect(spy.mock.calls[1][0]).toBe('foo');
    expect(runner).toBe(true);

    spy.mockRestore();
  });

  test('should throw if not functional runner', async () => {
    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: {
        default: 123 as any,
      },
    });

    try {
      await api.runTask(obj, 'test', {
        name: 'test',
      });
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err.message).toContain(
        'Expected runner function to be a function, got number'
      );
    }
  });

  test('should log error message if functional runner not returning a function', async () => {
    const spy = jest.spyOn(console, 'error');
    const obj = parsePineFile({
      test: (args: any) => console.log(args.name),
    });

    configure({
      runner: {
        default: (pinefile: any, name: string, args: any) => null,
      },
    });

    await api.runTask(obj, 'test', {
      name: 'test',
    });

    expect(spy.mock.calls[0][1].toString()).toContain(
      'Error: Expected return value of runner function to be a function, got null'
    );

    spy.mockRestore();
  });
});
