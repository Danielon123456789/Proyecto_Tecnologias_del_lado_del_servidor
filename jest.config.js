module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/**/*.test.(ts|js)'],  // Actualiza también el patrón de test
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'],   // Actualiza la ruta de setup
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
};