module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/modules/venues/service.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 50,
      lines: 80,
      statements: 80,
    },
  },
};
