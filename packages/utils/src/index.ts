export const encodeArgs = (args: string[]): string[] =>
  args.map((arg) => {
    if (/[^\w/:=-]/.test(arg)) {
      arg = `"${arg.replace(/"/g, '"\\"')}"`;
      arg = arg.replace(/^(?:"")+/g, '').replace(/\\"""/g, '\\"');
    }

    return arg;
  });

export const escapeArgs = (args: string[]): string =>
  encodeArgs(args).join(' ');
