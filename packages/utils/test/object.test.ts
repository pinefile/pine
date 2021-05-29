import { isObject, merge, omit } from '../src/object';

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

test('merge', () => {
  expect(merge({ a: 1 }, { b: 1 })).toEqual({ a: 1, b: 1 });
});

test('omit', () => {
  expect(omit('foo', { foo: true }).foo).toBeUndefined();
});
