export const escapeArgs = (args: string[]): string[] =>
  args.map((arg) => {
    if (/[^\w/:=-]/.test(arg)) {
      arg = `"${arg.replace(/"/g, '"\\"')}"`;
      arg = arg.replace(/^(?:"")+/g, '').replace(/\\"""/g, '\\"');
    }

    return arg;
  });

export const toArr = (val: any) =>
  Array.isArray(val) ? val : val == null ? [] : [val];
