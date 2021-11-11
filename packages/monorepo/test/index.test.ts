import { configure } from '@pinefile/pine';
import glob from 'glob';
import { execRun, findPackages, npmRun } from '../src';

let scripts = {};

jest.mock('@pinefile/pine', () => {
  const actual = jest.requireActual('@pinefile/pine') as any;
  return {
    ...actual,
    shell: async (cmd: string, opts: any = {}) => {
      const output = await actual.shell(cmd, opts);
      scripts[cmd] = (scripts[cmd] || []).concat(output);
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

  test('should run build script in every workspace with template string', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    await npmRun`build`;

    expect(scripts["echo 'building bar'"]).toBeDefined();
    expect(scripts["echo 'building foo'"]).toBeDefined();
  });

  test('should run pwd script in every workspace', async () => {
    await npmRun('pwd', {
      workspaces: [`${__dirname}/fixtures/packages`],
    });

    expect(scripts["echo 'bar' && echo $PWD"][0]).toContain(
      'packages/monorepo/test/fixtures/packages/bar'
    );
    expect(scripts["echo 'foo' && echo $PWD"][0]).toContain(
      'packages/monorepo/test/fixtures/packages/foo'
    );
  });

  test('should run build script in for scoped packages', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    await npmRun('build', {
      scope: 'foo',
    });

    expect(scripts["echo 'building bar'"]).toBeUndefined();
    expect(scripts["echo 'building foo'"]).toBeDefined();
  });

  test('should run build script in for unscoped packages', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    await npmRun('build', {
      scope: '!foo',
    });

    expect(scripts["echo 'building bar'"]).toBeDefined();
    expect(scripts["echo 'building foo'"]).toBeUndefined();
  });

  test('should execute echo script in for all packages', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    await execRun('echo "pine"');

    const pkgs = glob.sync(`${__dirname}/fixtures/packages/*/package.json`);

    expect(scripts['echo "pine"'].length).toBe(pkgs.length);
  });

  test('should find packages in every workspace', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    const packages = findPackages().map((p) => p.name);

    expect(['bar', 'foo', 'pub']).toStrictEqual(packages);
  });

  test('should exclude packages in every workspace', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages'] });

    const packages = findPackages({
      scope: '!foo',
    }).map((p) => p.name);

    expect(['bar', 'pub']).toStrictEqual(packages);
  });

  test('should exclude scoped packages in every workspace', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages2'] });

    const packages = findPackages({
      scope: '!@packages2/git',
    }).map((p) => p.name);

    expect(['@packages2/jit']).toStrictEqual(packages);
  });

  test('should include scoped packages in every workspace', async () => {
    configure({ root: __dirname, workspaces: ['fixtures/packages2'] });

    const packages = findPackages({
      scope: '@packages2/git',
    }).map((p) => p.name);

    expect(['@packages2/git']).toStrictEqual(packages);
  });
});
