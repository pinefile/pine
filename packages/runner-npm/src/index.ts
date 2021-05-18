import {
  api,
  getConfig,
  run,
  PineFileType,
  ArgumentsType,
} from '@pinefile/pine';

const runner = async (
  pinefile: PineFileType,
  name: string,
  args: ArgumentsType
) => {
  const task = api.resolveTask(pinefile, name);
  if (task) {
    await task(args);
  } else {
    const { root } = getConfig();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require(`${root}/package.json`);
    if (pkg.scripts[name]) {
      await run(pkg.scripts[name]);
    }
  }
};

export default api.createRunner(runner);
