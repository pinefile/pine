import { runCLI, getConfig, configure } from '../src';

describe('pine', () => {
  let run: any = null;

  beforeEach(() => {
    jest.resetModules();
    run = runCLI;
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
    expect(callOrder).toEqual(order.length ? order : [task]);
  };

  test('should run basic pinefile', async () => {
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

  test('should run default task', () => {
    const spy = jest.spyOn(console, 'log');
    runTask('basic', 'default');
    expect(spy).toHaveBeenCalledWith('Default...');
    expect(getConfig().task).toBe('default');
    spy.mockRestore();
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

  test('should slice name from rest of arguments', async () => {
    const spy = jest.spyOn(console, 'log');
    runTask('basic', 'sliceNameFromArgv');
    expect(spy).toHaveBeenCalledWith('Argv length 0');
    expect(getConfig().task).toBe('sliceNameFromArgv');
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

  test('should find and run basic:key:string task', async () => {
    const spy = jest.spyOn(console, 'log');
    runTask('basic', 'basic:key:string');
    expect(spy).toHaveBeenCalledWith('basic:key:string');
    spy.mockRestore();
  });

  test('should find and run basic:basic2:key:string task', async () => {
    const spy = jest.spyOn(console, 'log');
    runTask('basic', 'basic:basic2:key:string');
    expect(spy).toHaveBeenCalledWith('basic2:key:string');
    spy.mockRestore();
  });
});
