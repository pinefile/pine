import { configure, getConfig } from '../src/config';

describe('config', () => {
  let originalConfig;

  beforeEach(() => {
    // restore existing configuration at the end
    configure((existingConfig) => {
      originalConfig = existingConfig;
      return {};
    });
  });
  afterEach(() => {
    configure(originalConfig);
  });

  beforeEach(() => {
    configure({ other: 123 });
  });

  test('set custom option', () => {
    configure({
      options: {
        name: { default: 'world' },
      },
    });
    const conf = getConfig();
    expect(conf.options.name.default).toEqual('world');
  });
});
