const { api } = require('../../../src');

module.exports = async (pinefile, name, args) => {
  return async () => {
    const task = api.resolveTask(pinefile, name);
    if (task) {
      await task(args);
    }
  };
};
