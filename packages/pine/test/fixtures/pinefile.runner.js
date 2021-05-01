const { api } = require('../../src');

module.exports = {
  runner1: async (pinefile, name, argv) => {
    return async () => {
      console.log(name);
    };
  },
  runner2: async (pinefile, name, argv) => {
    return () => {
      console.log(name);
    };
  },
  runner3: (pinefile, name, argv) => {
    return async () => {
      console.log(name);
    };
  },
  runner4: async (pinefile, name, argv) => {
    return () => {
      console.log(name);
    };
  },
  runner5: (pinefile, name, argv) => {
    return () => {
      console.log(name);
    };
  },
  runner6: (pinefile, name, argv) => {
    return (done) => {
      console.log(name);
      done();
    };
  },
  runner7: (pinefile, name, argv) => {
    if (argv) {
      return async () => {
        const task = api.resolveTask(name, pinefile);
        await task({ name: 'runner7' });
      };
    }

    // pinefile arg is argv at this point.
    console.log(pinefile.name);
  },
};
