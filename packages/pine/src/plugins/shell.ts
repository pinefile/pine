import stream from 'stream';
import execa, { Options } from 'execa';

const toError = (obj: any) => {
  const err = obj instanceof Error ? obj : new Error(obj);

  if (obj.shortMessage !== undefined) {
    obj.message = obj.shortMessage;
    delete obj.shortMessage;
  }

  return err;
};

/**
 * Run shell command.
 *
 * @param {string} cmd
 * @param {object} opts
 *
 * @return {Promise}
 */
export const shell = (
  cmd: string,
  opts: Partial<Options> = {}
): Promise<any> => {
  const s = cmd.split(/\s/);

  return new Promise((resolve, reject) => {
    const sp = execa(s[0], s.slice(1), {
      ...opts,
      env: {
        // @ts-ignore
        FORCE_COLOR: process.env.FORCE_COLOR === '1',
        ...opts?.env,
      },
    });

    if (opts?.stdout && opts.stdout instanceof stream.Stream) {
      sp?.stdout?.pipe(opts.stdout as any);
      sp?.stderr?.pipe((opts.stderr || opts.stdout) as any);
    } else {
      sp.then((res) => resolve(res.stdout)).catch((err) =>
        reject(toError(err))
      );
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
export const run = (cmd: string, opts: Partial<Options> = {}) =>
  shell(cmd, {
    ...opts,
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
  });
