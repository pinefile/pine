import path from 'path';
import fs from 'fs';
import os from 'os';
import * as uuid from 'uuid';
import { shell } from '../../src/plugins/shell';

describe('shell', () => {
  test('should run shell commands', async () => {
    [
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
      expect(err).toBeInstanceOf(Error);
      expect(true).toBeTruthy();
    }
  });

  test('should not throw error when using &&', async () => {
    try {
      await shell('ls && echo ls');
      expect(true).toBeTruthy();
    } catch (err) {
      expect(false).toBeTruthy();
    }
  });

  test('should write stream to file', async () => {
    const file = path.join(os.tmpdir(), `${uuid.v4()}.txt`);
    await shell('echo "hello"', {
      stdout: fs.openSync(file, 'w'),
    });
    expect(fs.readFileSync(file, 'utf8')).toContain('hello');
  });
});
