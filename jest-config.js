// jest.config.js
export const transform = {
    '^.+\\.[t|j]sx?$': 'babel-jest',
};
export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['<rootDir>/setupTests.js'];
  