import { spawn } from 'child_process';

type ShellOptionsType = {
  cwd: string;
  outputStream: NodeJS.WriteStream;
};

export const shell = (cmd: string, opts?: ShellOptionsType) => {
  const cwd = opts?.cwd || process.cwd();
  const outputStream = opts?.outputStream;

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const sp = spawn(cmd, [], { cwd, shell: true });

    if (outputStream) {
      sp.stdout.pipe(outputStream);
      sp.stderr.pipe(outputStream);
    }

    sp.stdout.on('data', (data: string) => {
      if (!outputStream) {
        stdout += data;
      }
    });

    sp.stderr.on('data', (data: string) => {
      if (!outputStream) {
        stdout += data;
      }

      stderr += data;
    });

    sp.on('error', (err: Error) => {
      reject(err);
    });

    sp.on('close', (code: number) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(stderr.trim()));
      }
    });
  });
};
