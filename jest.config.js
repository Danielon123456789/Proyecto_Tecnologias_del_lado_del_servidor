module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/**/*.test.(ts|js)'],
  setupFiles: ['./src/__tests__/env.setup.js'],        // Corre ANTES de cargar módulos
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],   // Corre después, conecta MongoDB en memoria
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
};