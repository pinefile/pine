import { camelCaseToDash, escapeArgs, isObject } from '../src';

test('escapeArgs', () => {
  [
    {
      input: ['jest', '--config', 'jest.config.js'],
      output: 'jest --config "jest.config.js"',
    },
  ].forEach((t) => {
    expect(escapeArgs(t.input).join(' ')).toBe(t.output);
  });
});

test('isObject', () => {
  [
    {
      input: {},
      output: true,
    },
    {
      input: [],
      output: false,
    },
    {
      input: 1,
      output: false,
    },
    {
      input: '',
      output: false,
    },
    {
      input: null,
      output: false,
    },
    {
      input: undefined,
      output: false,
    },
    {
      input: function () {},
      output: false,
    },
  ].forEach((t) => {
    expect(isObject(t.input)).toBe(t.output);
  });
});

test('camelCaseToDash', () => {
  [
    {
      input: 'userId',
      output: 'user-id',
    },
    {
      input: 'waitAMoment',
      output: 'wait-a-moment',
    },
    {
      input: 'TurboPascal',
      output: 'turbo-pascal',
    },
  ].forEach((t) => {
    expect(camelCaseToDash(t.input)).toBe(t.output);
  });
});
