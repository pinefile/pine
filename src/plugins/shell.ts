import { spawn } from 'child_process';

type ShellOptionsType = {
  cwd: string;
};

export const shell = (cmd: string, opts?: ShellOptionsType) => {
  const cwd = opts?.cwd || process.cwd();

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const sp = spawn(cmd, [], { cwd, shell: true });

    sp.stdout.on('data', (data: string) => {
      stdout += data;
    });

    sp.stderr.on('data', (data: string) => {
      stderr += data;
    });

    sp.on('error', (err: Error) => {
      reject(err);
    });

    sp.on('close', (code: number) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        const error = new Error(stderr.trim());
        error.code = code;
        error.stdout = stdout.trim();
        reject(error);
      }
    });
  });
};
