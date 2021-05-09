import { configure, getArgs } from '../src';
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

  test('get parsed args', () => {
    const args = parse(['--bar', 'foo']);
    expect(args.bar).toBe('foo');
    expect(getArgs().bar).toBe('foo');
  });
});
