import { option, parse } from '../src/args';

describe('args', () => {
  test('option', () => {
    option('name', { default: 'bar' });

    let args = parse(['--name']);
    expect(args.name).toBe('bar');

    args = parse(['--name', 'foo']);
    expect(args.name).toBe('foo');
  });

  test('parse', () => {
    const args = parse(['--bar', 'foo']);
    expect(args.bar).toBe('foo');
  });
});
