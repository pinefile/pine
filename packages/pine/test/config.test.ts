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

  test('set environment variables', () => {
    configure({
      env: {
        STRING: 'pine',
        PORT: 8080,
        ARRAY: [1, 2],
      },
    });

    const conf = getConfig();

    expect(process.env.STRING).toBe('pine');
    expect(process.env.PORT).toBe('8080');
    expect(process.env.ARRAY).toBe('1,2');
  });
});
