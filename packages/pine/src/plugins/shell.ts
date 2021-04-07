import execa from 'execa';

type ShellOptionsType = {
  /**
   * Current working directory of the child process.
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * Environment key-value pairs.
   *
   * @default process.stderr
   */
  env?: NodeJS.ProcessEnv;

  /**
   * stdout write stream
   *
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;

  /**
   * stderr write stream
   *
   * @default process.stderr
   */
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
  const s = cmd.split(/\s/);

  return new Promise((resolve, reject) => {
    const sp = execa(s[0], s.slice(1), {
      cwd,
      shell: true,
      env: {
        // @ts-ignore
        FORCE_COLOR: process.env.FORCE_COLOR === '1',
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
    stderr: opts?.stderr || process.stderr,
    ...opts,
  });
