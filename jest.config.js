module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test-db-setup.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  verbose: true,
  testURL: 'http://localhost/',
  restoreMocks: true
}
