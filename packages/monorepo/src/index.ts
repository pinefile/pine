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
  Config,
  log,
  color,
} from '@pinefile/pine';

type Package = Record<string, any>;

type BaseRunOptions = {
  scope: string | string[];
  parallel: boolean;
  workspaces: string[];
};

export type ExecRunOptions = BaseRunOptions;

export type NPMRunOptions = BaseRunOptions & {
  exec: boolean;
};

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

const mergeConfig = (config: Config, opts: NPMRunOptions): NPMRunOptions => ({
  ...opts,
  workspaces: appendRoot(config.root, [
    ...opts.workspaces,
    ...(config.workspaces instanceof Array ? config.workspaces : []),
  ]),
});

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

export const npmRun = async (
  script: string,
  opts: Partial<NPMRunOptions> = {},
  shellOptions: Partial<ShellOptions> = {}
) => {
  const config = getConfig();
  const { workspaces, ...options }: NPMRunOptions = mergeConfig(config, {
    exec: false,
    scope: [],
    parallel: false,
    workspaces: ['packages'],
    ...opts,
  });

  const pattern = `${
    workspaces.length > 1 ? `{${workspaces.join(',')}}` : workspaces[0]
  }/*/package.json`;

  let pkgs = glob
    .sync(pattern)
    .map((p: string) => path.resolve(p))
    .map((p: string) => ({
      scripts: {},
      location: p,
      ...require(p),
    }));

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

  if (options.parallel) {
    await parallel(tasks);
  } else {
    await series(tasks);
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
