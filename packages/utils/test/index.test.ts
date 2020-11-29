const { escapeArgs } = require('../src');

test('escapeArgs', () => {
  [
    {
      input: ['jest', '--config', 'jest.config.js'],
      output: 'jest --config "jest.config.js"',
    },
  ].forEach((t) => {
    expect(escapeArgs(t.input)).toBe(t.output);
  });
});
