export const resolve = (key: string, obj: any, sep = ':'): any => {
  const properties = (Array.isArray(key)
    ? key
    : key.split(sep)) as Array<string>;

  return (
    properties.reduce((prev: Array<any>, cur: string) => {
      return prev[cur] || '';
    }, obj) || obj[key]
  );
};
