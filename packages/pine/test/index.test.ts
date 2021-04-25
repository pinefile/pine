import { api, getConfig, configure } from '../src';

describe('pine', () => {
  let run: any = null;

  beforeEach(() => {
    jest.resetModules();
    run = api.runCLI;
  });

  afterEach(() => {
    process.env.LOG_LEVEL = '';
    jest.clearAllMocks();
  });

  const runTask = async (file: string, task: string, ...args: string[]) => {
    await run(
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
    await run([task, `--file=${__dirname}/fixtures/pinefile.${file}.js`]);
    console.log(callOrder);
    expect(callOrder).toEqual(order.length ? order : [task]);
  };

  test.only('should run basic pinefile', async () => {
    await testCallOrder('basic', 'build', ['build']);
  });

  test('should run sub commands', async () => {
    await testCallOrder('tasks', 'lerna:build', [
      'lerna:prebuild',
      'lerna:build',
      'lerna:postbuild',
    ]);
    await testCallOrder('tasks', 'lerna', [
      'lerna:predefault',
      'lerna:default',
      'lerna:postdefault',
    ]);
    await testCallOrder('tasks', 'lerna:string', [
      'lerna:prestring',
      'lerna:string',
      'lerna:poststring',
    ]);
  });

  test('should log if task is not found', () => {
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
});
