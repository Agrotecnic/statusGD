export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testMatch: ['**/tests/**/*.test.js'],
  clearMocks: true,
  resetMocks: true,
  transformIgnorePatterns: [
    '/node_modules/(?!(firebase|@firebase)/).+\\.js$'
  ],
  verbose: true
};