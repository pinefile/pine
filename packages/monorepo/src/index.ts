// @ts-ignore
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import {
  series,
  run as pineRun,
  parallel,
  ShellOptionsType,
  getConfig,
  ConfigType,
} from '@pinefile/pine';

export type NPMRunOptionsType = {
  parallel: boolean;
  workspaces: string[];
};

const appendRoot = (root: string, workspaces: string[]) =>
  workspaces.map((workspace: string) =>
    fs.existsSync(workspace) ? workspace : path.join(root, workspace)
  );

const mergeConfig = (
  config: ConfigType,
  opts: NPMRunOptionsType
): NPMRunOptionsType => ({
  ...opts,
  workspaces: appendRoot(config.root, [
    ...opts.workspaces,
    ...(config.workspaces instanceof Array ? config.workspaces : []),
  ]),
});

export const npmRun = async (
  script: string,
  opts: Partial<NPMRunOptionsType> = {},
  shellOptions: Partial<ShellOptionsType> = {}
) => {
  const config = getConfig();
  const { workspaces, ...options }: NPMRunOptionsType = mergeConfig(config, {
    parallel: false,
    workspaces: [],
    ...opts,
  });

  const pattern = `${
    workspaces.length > 1 ? `{${workspaces.join(',')}}` : workspaces[0]
  }/*/package.json`;

  const pkgs = glob.sync(pattern);

  const tasks = pkgs.map((p: string) => async () => {
    const pkg = { scripts: {}, ...require(p) };
    if (pkg.scripts[script]) {
      await pineRun(pkg.scripts[script], {
        ...shellOptions,
        cwd: path.dirname(p),
      });
    }
  });

  if (options.parallel) {
    await parallel(tasks);
  } else {
    await series(tasks);
  }
};
