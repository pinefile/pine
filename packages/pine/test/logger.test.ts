import { log, createLogger } from '../src/logger';

describe('logger', () => {
  test('can log info', () => {
    const spyLog = jest.spyOn(console, 'log');

    log.info('info');
    expect(spyLog.mock.calls[0][1]).toBe('info');

    const err = new Error('error');
    log.info(err);
    expect(spyLog.mock.calls[1][1]).toEqual(err);

    spyLog.mockRestore();
  });

  test('can log warn', () => {
    const spyWarn = jest.spyOn(console, 'warn');

    log.warn('warn');
    expect(spyWarn.mock.calls[0][1]).toBe('warn');

    const err = new Error('error');
    log.warn(err);
    expect(spyWarn.mock.calls[1][1]).toEqual(err);

    spyWarn.mockRestore();
  });

  test('can log error', () => {
    const spyError = jest.spyOn(console, 'error');

    log.error('error');
    expect(spyError.mock.calls[0][1]).toBe('error');

    const err = new Error('error');
    log.error(err);
    expect(spyError.mock.calls[1][1]).toEqual(err);

    spyError.mockRestore();
  });

  test('with custom prefix', () => {
    const spyLog = jest.spyOn(console, 'log');
    const logger = createLogger({ prefix: '[pine]' });

    logger.info('info');
    expect(spyLog.mock.calls[0][1]).toBe('[pine]');
    expect(spyLog.mock.calls[0][2]).toBe('info');

    spyLog.mockRestore();
  });
});
