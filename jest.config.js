module.exports = {
  roots: ['<rootDir>/ui', '<rootDir>/plugin'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        diagnostics: {
          exclude: ['**'],
        },
      },
    ],
  },
};
