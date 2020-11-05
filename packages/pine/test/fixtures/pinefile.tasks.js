module.exports = {
  lerna: require('./tasks/lerna'),
  'lerna:prestring': () => console.log('lerna:prestring'),
  'lerna:string': () => console.log('lerna:string'),
  'lerna:poststring': () => console.log('lerna:prestring'),
};
