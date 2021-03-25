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
    const conf = configure({
      options: {
        name: { default: 'world' },
      },
    });

    expect(conf.options.name.default).toEqual('world');
    expect(conf).toEqual(getConfig());
  });

  test('set environment variables', () => {
    configure({
      env: {
        STRING: 'pine',
        PORT: '' + 8080,
        ARRAY: [1, 2].join(','),
      },
    });

    expect(process.env.STRING).toBe('pine');
    expect(process.env.PORT).toBe('8080');
    expect(process.env.ARRAY).toBe('1,2');
  });

  test('should load .env', () => {
    configure({
      path: __dirname,
      dotenv: ['.env'],
    });

    expect(process.env.NAME).toBe('Pine');
  });
});
