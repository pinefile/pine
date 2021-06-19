import { configure, shell } from '@pinefile/pine';
import { npmRun } from '../src';

let scripts = {};

jest.mock('@pinefile/pine', () => {
  const actual = jest.requireActual('@pinefile/pine');
  return {
    ...actual,
    run: async (cmd: string, opts: any = {}) => {
      const actual = await shell(cmd, opts);
      scripts[cmd] = actual;
    },
  };
});

describe('monorepo', () => {
  beforeEach(() => {
    scripts = {};
  });

  afterEach(() => {
    configure({
      root: '',
      workspaces: undefined,
    });
  });

  test('should run build script in every workspace', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    await npmRun('build');

    expect(scripts["echo 'building bar'"]).toBeDefined();
    expect(scripts["echo 'building foo'"]).toBeDefined();
  });

  test('should run pwd script in every workspace', async () => {
    await npmRun('pwd', {
      workspaces: [`${__dirname}/fixtures/packages`],
    });

    expect(scripts["echo 'bar' && echo $PWD"]).toContain(
      'packages/monorepo/test/fixtures/packages/bar'
    );
    expect(scripts["echo 'foo' && echo $PWD"]).toContain(
      'packages/monorepo/test/fixtures/packages/foo'
    );
  });
});
