export const camelCaseToDash = (str: string) =>
  str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
