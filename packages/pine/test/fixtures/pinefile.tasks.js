const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const tasks = {
  monorepo: require('./tasks/monorepo'),
  'monorepo:prestring': () => console.log('monorepo:prestring'),
  'monorepo:string': () => console.log('monorepo:string'),
  'monorepo:poststring': () => console.log('monorepo:prestring'),
};

tasks.s1 = async () => {
  await delay(500);
  console.log('Cleaning...');
};

tasks.s2 = () => {
  console.log('Building...');
};

tasks.p1 = async () => {
  await delay(2500);
  console.log('Cleaning...');
};

tasks.p2 = async () => {
  console.log('Building...');
};

module.exports = tasks;
