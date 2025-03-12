// jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./test/setup.js'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/tests/'
    ]
  };