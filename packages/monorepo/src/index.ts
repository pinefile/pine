import fs from 'fs';
import path from 'path';
import os from 'os';
import glob from 'glob';
import multimatch from 'multimatch';
import {
  series,
  run as pineRun,
  parallel,
  ShellOptions,
  getConfig,
  log,
  color,
} from '@pinefile/pine';

const chunkArray = (arr: any[], size: number): any[] =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];

type Package = Record<string, any>;

type BaseOptions = {
  scope: string | string[];
  workspaces: string[];
};

type BaseRunOptions = BaseOptions & {
  parallel: boolean;
  parallelCount: number;
};

export type FindPackagesOptions = BaseOptions & {
  pattern: string;
};

export type NPMRunOptions = BaseRunOptions & {
  exec: boolean;
};

export type ExecRunOptions = BaseRunOptions;

let colorWheelCurrent = 0;
const colorWheel = [
  color.cyan,
  color.magenta,
  color.blue,
  color.yellow,
  color.green,
  color.red,
];

const pkgColor = (p: string) => {
  const fn = colorWheel[colorWheelCurrent % colorWheel.length];
  colorWheelCurrent++;
  return `${fn(p)}`;
};

const appendRoot = (root: string, workspaces: string[]) =>
  workspaces.map((workspace: string) =>
    fs.existsSync(workspace) ? workspace : path.join(root, workspace)
  );

const mergeConfig = <T>(opts: T): T => {
  const config = getConfig();
  return {
    ...opts,
    workspaces: appendRoot(config.root, [
      ...(config.workspaces instanceof Array ? [] : (opts as any).workspaces),
      ...(config.workspaces instanceof Array ? config.workspaces : []),
    ]),
  };
};

const filterPackages = (args: string | string[], pkgNames: string[]) => {
  const results: string[] = [];
  const search = !Array.isArray(args) ? [args] : args;

  if (!search.length) {
    return pkgNames;
  }

  const scoped = search.filter((n) => n.startsWith('@') || n.startsWith('!@'));

  if (scoped.length > 0) {
    const exclamation = scoped.some((n) => n.startsWith('!'));
    results.push(
      ...multimatch(pkgNames, [...(exclamation ? ['**'] : []), ...scoped])
    );
  }

  const unscoped = search.filter(
    (n) => !n.startsWith('@') && !n.startsWith('!@')
  );

  if (unscoped.length > 0) {
    const pkgMap = pkgNames.reduce((prev, cur) => {
      const name = cur.replace(/^@[^/]+\//, '');
      return {
        ...prev,
        [name]: (prev[name] || []).concat(cur),
      };
    }, {});

    const exclamation = unscoped.some((n) => n.startsWith('!'));
    const matched = multimatch(Object.keys(pkgMap), [
      ...(exclamation ? ['*'] : []),
      ...unscoped,
    ]);

    for (const name of matched) {
      for (const pkg of pkgMap[name]) {
        results.push(pkg);
      }
    }
  }

  return [...new Set(results)];
};

export const findPackages = (opts: Partial<FindPackagesOptions> = {}) => {
  const { workspaces, ...options } = mergeConfig<FindPackagesOptions>({
    pattern: '',
    scope: [],
    workspaces: ['packages'],
    ...opts,
  });

  const pattern = options.pattern
    ? options.pattern
    : `${
        workspaces.length > 1 ? `{${workspaces.join(',')}}` : workspaces[0]
      }/*/package.json`;

  const pkgs = glob
    .sync(pattern)
    .map((p: string) => path.resolve(p))
    .map((p: string) => ({
      scripts: {},
      location: p,
      ...require(p),
    }));

  const pkgsNames = pkgs.map((p) => p.name);

  return filterPackages(options.scope, pkgsNames).map((name) =>
    pkgs.find((p) => p.name === name)
  );
};

export const npmRun = async (
  cmd: string | string[] | TemplateStringsArray,
  opts: Partial<NPMRunOptions> = {},
  shellOptions: Partial<ShellOptions> = {}
) => {
  const script = cmd instanceof Array ? cmd.join(' ') : cmd;
  const options = mergeConfig<NPMRunOptions>({
    exec: false,
    scope: [],
    parallel: false,
    parallelCount: os.cpus().length,
    workspaces: [],
    ...opts,
  });

  let pkgs = findPackages({
    scope: options.scope,
    workspaces: options.workspaces,
  });

  if (options.exec) {
    pkgs = pkgs.map((pkg: Package) => ({
      ...pkg,
      scripts: { [script]: script },
    }));
  }

  const tasks = pkgs
    .filter((pkg: Package) => !!pkg.scripts[script])
    .map((pkg: Package) => async () => {
      log.info(pkgColor(`${pkg.name}: ${script}`));
      await pineRun(pkg.scripts[script], {
        ...shellOptions,
        cwd: path.dirname(pkg.location),
      });
    });

  if (!tasks.length) {
    log.info(`Script ${color.cyan(`'${script}'`)} not found in packages`);
    return;
  }

  if (!options.parallel) {
    return await series(tasks);
  }

  const chunks = chunkArray(tasks, options.parallelCount);

  for (let i = 0, l = chunks.length; i < l; i++) {
    await parallel(chunks[i]);
  }
};

export const execRun = async (
  script: string | string[] | TemplateStringsArray,
  opts: Partial<ExecRunOptions> = {},
  shellOptions: Partial<ShellOptions> = {}
) =>
  npmRun(
    script,
    {
      ...opts,
      exec: true,
    },
    shellOptions
  );
