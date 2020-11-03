import fs from 'fs';

describe('pine', () => {
  let run;

  beforeEach(() => {
    jest.resetModules();
    run = require('../src').runTask;
  });

  afterEach(() => {
    process.env.LOG_LEVEL = '';
    jest.clearAllMocks();
  });

  const runTask = async (file, task) => {
    const module = require(`./fixtures/pinefile.${file}.js`);
    await run([task, `--file=${__dirname}/fixtures/pinefile.${file}.js`]);
  };

  const testCallOrder = async (file, task, order = []) => {
    const module = require(`./fixtures/pinefile.${file}.js`);
    const callOrder = [];
    order.forEach(
      (f) => (module[f] = jest.fn().mockImplementation(() => callOrder.push(f)))
    );
    await run([task, `--file=${__dirname}/fixtures/pinefile.${file}.js`]);
    expect(callOrder).toEqual(order.length ? order : [task]);
  };

  it('should run basic pinefile', async () => {
    await testCallOrder('before', 'build', ['build']);
  });

  it('should run pinefile with before tasks', async () => {
    await testCallOrder('before', 'build', ['compile', 'write', 'build']);
  });

  it('should run pinefile with before tasks with array', async () => {
    await testCallOrder('before', 'array', ['compile', 'array']);
  });

  it('should run pinefile with after tasks', async () => {
    await testCallOrder('after', 'build', ['build', 'compile', 'write']);
  });

  it('should run pinefile with after tasks with array', async () => {
    await testCallOrder('after', 'array', ['array', 'compile']);
  });

  it('should run sub commands', async () => {
    const spy = jest.spyOn(console, 'log');
    runTask('tasks', 'lerna:build');
    runTask('tasks', 'lerna:string');
    expect(spy.mock.calls[1][0]).toEqual('lerna:build');
    expect(spy.mock.calls[3][0]).toEqual('lerna:string');
    spy.mockRestore();
  });

  it('should require files before run using package.json config', () => {
    const spy = jest.spyOn(console, 'log');
    jest.mock('../../../package.json', () => {
      return {
        pine: {
          requires: [`${process.cwd()}/packages/pine/test/fixtures/require.js`],
        },
      };
    });
    run([`--file=${__dirname}/fixtures/pinefile.basic.js`, 'build']);
    expect(spy).toHaveBeenCalledWith('Required...');
    expect(spy).toHaveBeenCalledWith('Building...');
    jest.unmock('../../../package.json');
    spy.mockRestore();
  });
});
