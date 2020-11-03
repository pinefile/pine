module.exports = {
  lerna: require('./tasks/lerna'),
  'lerna:string': () => console.log('lerna:string'),
}
