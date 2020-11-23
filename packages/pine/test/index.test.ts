// root package.json
jest.mock('../../../package.json', () => {
  return {
    pine: {
      requires: [`${process.cwd()}/packages/pine/test/fixtures/require.js`],
    },
  };
});

describe('pine', () => {
  let run;

  beforeEach(() => {
    jest.resetModules();
    run = require('../src').runCLI;
  });

  afterEach(() => {
    process.env.LOG_LEVEL = '';
    jest.clearAllMocks();
  });

  const runTask = async (file, task) => {
    await run([task, `--file=${__dirname}/fixtures/pinefile.${file}.js`]);
  };

  const testCallOrder = async (file, task, order = []) => {
    const module = require(`./fixtures/pinefile.${file}.js`);
    const callOrder = [];
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

  test('should require files before run using package.json config', () => {
    const spy = jest.spyOn(console, 'log');
    runTask('basic', 'build');
    expect(spy).toHaveBeenCalledWith('Required...');
    expect(spy).toHaveBeenCalledWith('Building...');
    spy.mockRestore();
  });

  test('should fail', () => {
    expect(false).toBeTruthy();
  });
});
