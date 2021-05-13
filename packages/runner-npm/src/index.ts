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
  const { root } = getConfig();
  const pkg = require(`${root}/package.json`);
  const task = api.resolveTask(pinefile, name);
  if (task) {
    await task(args);
  } else if (pkg.scripts[name]) {
    await run(pkg.scripts[name]);
  }
};

export default api.createRunner(runner);
