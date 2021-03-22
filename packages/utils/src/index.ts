export const escapeArgs = (args: string[]): string[] =>
  args.map((arg) => {
    if (/[^\w/:=-]/.test(arg)) {
      arg = `"${arg.replace(/"/g, '"\\"')}"`;
      arg = arg.replace(/^(?:"")+/g, '').replace(/\\"""/g, '\\"');
    }

    return arg;
  });

export const isObject = (val: any): boolean =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

export const camelCaseToDash = (str: string) =>
  str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
