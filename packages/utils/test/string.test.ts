import { camelCaseToDash } from '../src/string';

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
