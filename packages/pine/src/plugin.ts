import { Arguments } from './args';
import { Config, getConfig } from './config';
import { PineFile } from './file';

let _pluginConfig: PluginConfig = {
  ...getConfig(),
  pinefile: {} as PineFile,
  task: 'default',
  args: {} as Arguments
};

type PluginConfig = Config & {
  pinefile: PineFile;
  task: string;
  args: Arguments;
};

export const getPluginConfig = (): PluginConfig => ({
  ...getConfig(),
  ..._pluginConfig,
});

export const setPluginPinefile = (
  pinefile: PineFile,
  task: string,
  args: Arguments,
) => {
  _pluginConfig = { ..._pluginConfig, pinefile, task, args };
};
