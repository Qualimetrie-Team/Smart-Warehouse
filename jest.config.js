module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    'routes/**/*.js'
  ],
  coverageReporters: ['lcov', 'text', 'clover'],
  coverageDirectory: 'coverage'
};