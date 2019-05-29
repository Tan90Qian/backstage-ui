module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'no-use-before-define': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/jsx-one-expression-per-line': [0],
    'import/no-unresolved': [0],
    'import/prefer-default-export': [0],
    'import/no-extraneous-dependencies': [0],
    '@typescript-eslint/interface-name-prefix': [0],
    '@typescript-eslint/no-use-before-define': [0],
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/no-explicit-any': [0],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  parserOptions: {
    project: 'tsconfig.json',
  },
  settings: {
    polyfills: ['fetch', 'promises'],
  },
};
