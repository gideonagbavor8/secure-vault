import type { Config } from 'jest';
import dotenv from 'dotenv';

// Load env files before setting DATABASE_URL
dotenv.config();

// Always force NODE_ENV to 'test' for tests
process.env.NODE_ENV = 'test';

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@scure|@otplib|otplib|@noble)/)',
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

export default config;
