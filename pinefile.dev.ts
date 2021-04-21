import { createLogger, LoggerOptions } from './packages/pine';

const options: LoggerOptions = {
  prefix: '[pine]',
};
const log = createLogger(options);
log.info(');');
