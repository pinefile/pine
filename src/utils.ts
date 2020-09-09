export const flattenArray = (a: Array<any>) =>
  a.reduce((accumulator: any, value: any) => accumulator.concat(value), []);
