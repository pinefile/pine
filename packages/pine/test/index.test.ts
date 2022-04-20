import { api, getConfig, configure } from '../src';

// @ts-ignore
global.getConfig = getConfig;

describe('pine', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const runTask = async (file: string, task: string, ...args: string[]) => {
    await api.runCLI(
      [task, `--file=${__dirname}/fixtures/pinefile.${file}.js`].concat(args)
    );
  };

  const testCallOrder = async (
    file: string,
    task: string,
    order: string[] = []
  ) => {
    const module = require(`./fixtures/pinefile.${file}.js`);
    const callOrder: string[] = [];
    order.forEach((f) => {
      if (module[f]) {
        module[f] = jest.fn().mockImplementation(() => callOrder.push(f));
      } else {
        f.split(':').reduce((prev, cur) => {
          if (typeof prev[cur] !== 'object') {
            prev[cur] = jest.fn().mockImplementation(() => callOrder.push(f));
          }
          return prev[cur];
        }, module);
      }
    });
    await api.runCLI([
      task,
      `--file=${__dirname}/fixtures/pinefile.${file}.js`,
    ]);
    expect(callOrder).toEqual(order.length ? order : [task]);
  };

  test('should run basic pinefile', async () => {
    await testCallOrder('basic', 'build', ['build']);
  });

  test('should run sub commands', async () => {
    await testCallOrder('tasks', 'monorepo:build', [
      'monorepo:prebuild',
      'monorepo:build',
      'monorepo:postbuild',
    ]);
    await testCallOrder('tasks', 'monorepo', [
      'monorepo:predefault',
      'monorepo:default',
      'monorepo:postdefault',
    ]);
    await testCallOrder('tasks', 'monorepo:string', [
      'monorepo:prestring',
      'monorepo:string',
      'monorepo:poststring',
    ]);
  });

  test.skip('should log if task is not found', () => {
    const spy = jest.spyOn(console, 'error');
    runTask('basic', 'missing');
    expect(spy.mock.calls[0][1].indexOf('missing')).toBeGreaterThan(-1);
    spy.mockRestore();
  });

  test('should require files before run using package.json config', () => {
    const spy = jest.spyOn(console, 'log');
    runTask(
      'basic',
      'build',
      `--require=${process.cwd()}/packages/pine/test/fixtures/require.js`
    );
    expect(spy).toHaveBeenCalledWith('Required...');
    expect(spy).toHaveBeenCalledWith('Building...');
    expect(getConfig().task).toBe('build');
    spy.mockRestore();
  });

  test('should use default args value for custom name option', async () => {
    configure({
      options: {
        name: {
          default: 'world',
        },
      },
    });

    const spy = jest.spyOn(console, 'log');
    runTask('basic', 'sayhello');
    expect(spy).toHaveBeenCalledWith('Hello world');
    expect(getConfig().task).toBe('sayhello');
    spy.mockRestore();
  });

  test('should run tasks', () => {
    const tests = [
      {
        task: 'default',
        output: 'Default...',
      },
      {
        task: 'sliceNameFromArgv',
        output: 'Argv length 0',
      },
      {
        task: 'basic:key:string',
        output: 'basic:key:string',
      },
      {
        task: 'basic:basic2:key:string',
        output: 'basic2:key:string',
      },
    ];

    tests.forEach((test) => {
      const spy = jest.spyOn(console, 'log');
      runTask('basic', test.task);
      expect(spy).toHaveBeenCalledWith(test.output);
      expect(getConfig().task).toBe(test.task);
      spy.mockRestore();
    });
  });

  test('should verify that configure is runned in the right order', () => {
    const spy = jest.spyOn(console, 'log');
    runTask('config', 'config');
    expect(spy).toHaveBeenCalledWith('config');
    expect(getConfig().task).toBe('config');
    spy.mockRestore();
  });
});
