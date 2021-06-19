// @ts-ignore
import glob from 'glob';
import path from 'path';
import {
  series,
  run as pineRun,
  parallel,
  ShellOptionsType,
  getConfig,
} from '@pinefile/pine';

export type NPMRunOptionsType = {
  parallel: boolean;
  workspaces: string[];
};

export const npmRun = async (
  script: string,
  opts: Partial<NPMRunOptionsType> = {},
  shellOptions: Partial<ShellOptionsType> = {}
) => {
  const { workspaces, ...options }: NPMRunOptionsType = {
    parallel: false,
    workspaces: [],
    ...opts,
  };

  const { root } = getConfig();

  const pattern = `${root.length ? root + '/' : ''}${
    workspaces.length > 1 ? `{${workspaces.join(',')}}` : workspaces[0]
  }/*/package.json`;

  const pkgs = glob.sync(pattern);

  const tasks = pkgs.map((p: string) => async () => {
    const pkg = { scripts: {}, ...require(p) };
    await pineRun(pkg.scripts[script], {
      ...shellOptions,
      cwd: path.dirname(p),
    });
  });

  if (options.parallel) {
    await parallel(tasks);
  } else {
    await series(tasks);
  }
};
