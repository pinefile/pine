import { shell } from '../../src/plugins/shell';

describe('shell', () => {
  it('can run shell commands', async () => {
    const tests = [
      {
        input: 'echo "hello"',
        output: 'hello',
      },
      {
        input: 'ls -la',
        output: 'total',
      },
    ].forEach(async (test) => {
      const output = await shell(test.input);
      expect(output).toContain(test.output);
    });
  });
});
