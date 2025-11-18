/** @type {import('jest').Config} */

// Shared module name mappings
const moduleNameMapper = {
  // DDD path aliases
  '^@domain/(.*)$': '<rootDir>/src/domain/$1',
  '^@application/(.*)$': '<rootDir>/src/application/$1',
  '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
  '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  // Next.js path alias
  '^@/(.*)$': '<rootDir>/$1',
  // CSS and static file mocks
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
};

const config = {
  collectCoverageFrom: [
    'src/**/*.ts',
    'lib/**/*.ts',
    'components/**/*.tsx',
    'app/**/*.tsx',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!app/layout.tsx',
    '!app/globals.css',
    '!lib/utils.ts', // Utility from shadcn
    '!components/ui/**/*.tsx', // Shadcn UI library components
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  projects: [
    // Backend tests (Node environment)
    {
      displayName: 'backend',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests'],
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts', '<rootDir>/tests/integration/**/*.test.ts'],
      moduleNameMapper,
    },
    // Frontend tests (jsdom environment)
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jest-environment-jsdom',
      roots: ['<rootDir>/tests'],
      testMatch: ['<rootDir>/tests/components/**/*.test.tsx', '<rootDir>/tests/lib/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper,
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: {
              jsx: 'react-jsx',
            },
          },
        ],
      },
    },
  ],
  passWithNoTests: true,
};

export default config;
