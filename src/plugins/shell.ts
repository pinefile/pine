import { spawn } from 'child_process';

type ShellOptionsType = {
  cwd: string;
  outputStream: NodeJS.WriteStream;
};

export const shell = (cmd: string, opts?: ShellOptionsType): Promise<unknown> => {
  const cwd = opts?.cwd || process.cwd();
  const outputStream = opts?.outputStream;

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    // @ts-ignore
    process.env.FORCE_COLOR = true;

    const sp = spawn(cmd, [], {
      cwd,
      shell: true,
      env: process.env,
    });

    if (outputStream) {
      // @ts-ignore
      sp.stdout.pipe(outputStream);
      // @ts-ignore
      sp.stderr.pipe(outputStream);
    }

    // @ts-ignore
    sp.stdout.on('data', (data: string) => {
      if (!outputStream) {
        stdout += data;
      }
    });

    // @ts-ignore
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
