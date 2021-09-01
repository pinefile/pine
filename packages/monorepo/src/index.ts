import glob from 'glob';
import multimatch from 'multimatch';
import fs from 'fs';
import path from 'path';
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
    results.push(...multimatch(pkgNames, scoped));
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

    const matched = multimatch(Object.keys(pkgMap), unscoped);
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

  return glob
    .sync(pattern)
    .map((p: string) => path.resolve(p))
    .map((p: string) => ({
      scripts: {},
      location: p,
      ...require(p),
    }));
};

export const npmRun = async (
  script: string,
  opts: Partial<NPMRunOptions> = {},
  shellOptions: Partial<ShellOptions> = {}
) => {
  const options = mergeConfig<NPMRunOptions>({
    exec: false,
    scope: [],
    parallel: false,
    parallelCount: 5,
    workspaces: [],
    ...opts,
  });

  let pkgs = findPackages({ workspaces: options.workspaces });
  let pkgNames = pkgs.map((pkg: Package) => pkg.name);

  pkgNames = filterPackages(options.scope, pkgNames);
  pkgs = pkgs.filter((pkg: Package) => pkgNames.includes(pkg.name));

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
  script: string,
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
