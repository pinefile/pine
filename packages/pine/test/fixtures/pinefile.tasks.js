const tasks = {
  lerna: require('./tasks/lerna'),
  'lerna:prestring': () => console.log('lerna:prestring'),
  'lerna:string': () => console.log('lerna:string'),
  'lerna:poststring': () => console.log('lerna:prestring'),
};

tasks.s1 = (argv, done) => {
  setTimeout(() => {
    console.log('Cleaning...');
    done();
  }, 500);
};

tasks.s2 = async (argv, done) => {
  console.log('Building...');
  done();
};

tasks.p1 = async (argv, done) => {
  setTimeout(() => {
    console.log('Cleaning...');
    done();
  }, 5000);
};

tasks.p2 = async (argv, done) => {
  setTimeout(() => {
    console.log('Building...');
    done();
  }, 5000);
};

module.exports = tasks;
