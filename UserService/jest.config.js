export default {
  setupFiles: ['<rootDir>/test/setup.js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/test/fixtures/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
