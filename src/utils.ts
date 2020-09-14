export const flattenArray = (a: Array<any>) =>
  a.reduce((acc: any, value: any) => acc.concat(value), []);
