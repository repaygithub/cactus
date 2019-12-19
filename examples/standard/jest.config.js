module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  testRegex: '.*\\.test\\.(tsx?)$',
  verbose: true,
  coverageReporters: ['lcov', 'text', 'json-summary'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  globalSetup: './tests/config/setup.ts',
  globalTeardown: './tests/config/teardown.ts',
  testEnvironment: './tests/config/puppeteer-environment.js',
}
