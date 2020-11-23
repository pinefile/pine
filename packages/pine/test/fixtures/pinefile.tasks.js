const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const tasks = {
  lerna: require('./tasks/lerna'),
  'lerna:prestring': () => console.log('lerna:prestring'),
  'lerna:string': () => console.log('lerna:string'),
  'lerna:poststring': () => console.log('lerna:prestring'),
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
