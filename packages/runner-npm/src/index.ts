import {
  api,
  getConfig,
  run,
  PineFile,
  Arguments,
  RunnerOptions,
} from '@pinefile/pine';

const getPkg = (options: RunnerOptions = {}) => {
  const { root } = { ...getConfig(), ...options };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`${root}/package.json`);
};

const resolveTask = (
  pinefile: PineFile,
  name: string,
  options: RunnerOptions = {}
) => {
  const task = api.resolveTask(pinefile, name);
  if (task) {
    return task;
  }

  const pkg = getPkg(options);
  if (pkg.scripts[name]) {
    return async (args: Arguments) => {
      const str = (args._ || []).join(' ');
      await run(`${pkg.scripts[name]}${str.length ? ` ${str}` : ''}`);
    };
  }

  return false;
};

export const taskExists = (
  pinefile: PineFile,
  name: string,
  args: Arguments,
  options: RunnerOptions = {}
): boolean => !!resolveTask(pinefile, name, options);

export const runner = api.createRunner(
  async (
    pinefile: PineFile,
    name: string,
    args: Arguments,
    options: RunnerOptions = {}
  ) => {
    const task = resolveTask(pinefile, name, options);

    if (task) {
      return await task(args);
    }

    return false;
  }
);
