import {
  api,
  getConfig,
  run,
  PineFileType,
  ArgumentsType,
  RunnerOptionsType,
} from '@pinefile/pine';

const getPkg = (options: RunnerOptionsType = {}) => {
  const { root } = { ...getConfig(), ...options };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`${root}/package.json`);
};

const resolveTask = (
  pinefile: PineFileType,
  name: string,
  options: RunnerOptionsType = {}
) => {
  const task = api.resolveTask(pinefile, name);
  if (task) {
    return task;
  }

  const pkg = getPkg(options);
  if (pkg.scripts[name]) {
    return async (args: ArgumentsType) => {
      const str = (args._ || []).join(' ');
      await run(`${pkg.scripts[name]}${str.length ? ` ${str}` : ''}`);
    };
  }

  return false;
};

export const exists = (
  pinefile: PineFileType,
  name: string,
  args: ArgumentsType,
  options: RunnerOptionsType = {}
): boolean => !!resolveTask(pinefile, name, options);

export const runner = api.createRunner(
  async (
    pinefile: PineFileType,
    name: string,
    args: ArgumentsType,
    options: RunnerOptionsType = {}
  ) => {
    const task = resolveTask(pinefile, name, options);

    if (task) {
      return await task(args);
    }

    return false;
  }
);
