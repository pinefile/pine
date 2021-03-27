module.exports = {
  testMatch: ['<rootDir>/packages/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.[j|t]sx?$': 'ts-jest',
  },
};
