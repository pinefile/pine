import { run, shell } from '../../src/plugins/shell';

describe('shell', () => {
  test('should run shell commands', async () => {
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

  test('should throw when exit code is greater than 0', async () => {
    try {
      await shell('exit 1');
      expect(true).toBeFalsy();
    } catch (err) {
      expect(true).toBeTruthy();
    }
  });
});
