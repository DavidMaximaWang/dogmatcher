const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.spec.json');

module.exports = {
    roots: ['<rootDir>'],
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: './tsconfig.spec.json',
        }],
      },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '.+\\.(css|sass|scss|less|png|jpg|gif|svg)$': 'jest-transform-stub',

        ...pathsToModuleNameMapper(compilerOptions.paths ?? {}, { prefix: '<rootDir>/' })
    }
};
