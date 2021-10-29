import { configure, filterArgs, getArgs } from '../src';
import { parse } from '../src/args';

describe('args', () => {
  test('option', () => {
    configure({
      options: {
        name: { default: 'bar' },
      },
    });

    let args = parse(['--name']);
    expect(args.name).toBe('bar');

    args = parse(['--name', 'foo']);
    expect(args.name).toBe('foo');
  });

  test('parse args', () => {
    const args = parse(['--bar', 'foo']);
    expect(args.bar).toBe('foo');
  });

  test('parse args and remove default args with dashes', () => {
    const args = parse(['--no-color', '--bar', 'foo']);
    expect(args.bar).toBe('foo');
    expect(args.noColor).toBeTruthy();
    expect(args['no-color']).toBeUndefined();
  });

  test('get parsed args', () => {
    const args = parse(['--bar', 'foo']);
    expect(args.bar).toBe('foo');
    expect(getArgs().bar).toBe('foo');
  });

  test('filter args', () => {
    const args = parse(['--no-color', '-f', '--foo']);
    expect(args.noColor).toBeTruthy();
    const filtered = filterArgs(args);
    expect(filtered.noColor).toBeUndefined();
    expect(filtered.f).toBeUndefined();
  });
});
