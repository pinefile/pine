import execa from 'execa';

type EnvType = {
  [key: string]: any;
};

type ShellOptionsType = {
  cwd?: string;
  env?: EnvType;
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
};

/**
 * Run shell command.
 *
 * @param {string} cmd
 * @param {object} opts
 *
 * @return {Promise}
 */
export const shell = (cmd: string, opts?: ShellOptionsType): Promise<any> => {
  const cwd = opts?.cwd || process.cwd();
  const s = cmd.split(' ');

  return new Promise((resolve, reject) => {
    const sp = execa(s[0], s.slice(1), {
      cwd,
      shell: true,
      env: {
        // @ts-ignore
        FORCE_COLOR: true,
        ...opts?.env,
      },
    });

    if (opts?.stdout) {
      sp?.stdout?.pipe(opts.stdout);
      sp?.stderr?.pipe(opts.stderr || opts.stdout);
    } else {
      sp.then((r) => resolve(r.stdout)).catch(reject);
    }

    sp.on('close', (code: number) => {
      if (code !== 0) {
        process.exitCode = code;
      }

      if (opts?.stdout) {
        resolve(null);
      }
    });
  });
};

/**
 * Run shell command.
 *
 * @param {string} cmd
 * @param {object} opts
 *
 * @return {Promise}
 */
export const run = (cmd: string, opts?: ShellOptionsType) =>
  shell(cmd, {
    stdout: opts?.stdout || process.stdout,
    ...opts,
  });
