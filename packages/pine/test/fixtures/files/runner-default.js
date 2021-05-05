const { api } = require('../../../src');

module.exports = {
  default: async (pinefile, name, args) => {
    return async () => {
      const task = api.resolveTask(pinefile, name);
      if (task) {
        await task(args);
      }
    };
  },
};
