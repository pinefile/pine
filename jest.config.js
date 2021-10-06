module.exports = {
  testMatch: ['<rootDir>/packages/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
