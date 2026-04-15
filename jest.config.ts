import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterFramework: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 60,
      functions: 60,
      branches: 60,
      statements: 60,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(@angular|@ngrx|rxjs|zone\\.js)/)'],
};

export default config;
