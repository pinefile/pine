import { configure } from '@pinefile/pine';
import { exists, runner } from '../src';

let scripts = {};

jest.mock('@pinefile/pine', () => {
  const actual = jest.requireActual('@pinefile/pine');
  return {
    ...actual,
    run: (cmd: string, opts: any = {}) => {
      scripts[cmd] = true;
      return actual.run(cmd, opts);
    },
  };
});

configure({
  root: `${__dirname}/..`,
});

describe('runner-npm', () => {
  test('should run task in pinefile', async () => {
    const spy = jest.spyOn(console, 'log');

    let executed = false;

    const obj = {
      test: {
        _: () => {
          executed = true;
          console.log('test');
        },
      },
    };

    const realRunner = await runner(obj, 'test', {});
    await realRunner();

    expect(spy.mock.calls[0][0]).toBe('test');
    expect(executed).toBeTruthy();

    spy.mockRestore();
  });

  test('should run task in package.json', async () => {
    const realRunner = await runner({}, 'foo', {});
    await realRunner();

    expect(scripts['echo foo']).toBeTruthy();
  });

  test('should run task in package.json and pass args', async () => {
    const realRunner = await runner({}, 'foo', {
      _: ['bar'],
    });
    await realRunner();

    expect(scripts['echo foo bar']).toBeTruthy();
  });

  test('should check if task or script exists', () => {
    const obj = {
      test: {
        _: () => {
          console.log('test');
        },
      },
    };

    expect(exists(obj, 'foo', {})).toBeTruthy();
    expect(exists(obj, 'test', {})).toBeTruthy();
    expect(exists(obj, 'bar', {})).toBeFalsy();
  });
});
