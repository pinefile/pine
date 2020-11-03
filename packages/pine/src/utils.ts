export const resolve = (key: string, obj: any, sep: string = ':'): any => {
  const properties = (Array.isArray(key) ? key : key.split(sep)) as Array<
    string
  >;
  return properties.reduce((prev: Array<any>, cur: string) => {
    return prev[cur];
  }, obj);
};
