module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
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
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'import/no-unresolved': [0],
    'react/jsx-one-expression-per-line': [0],
    '@typescript-eslint/interface-name-prefix': [0],
    'no-use-before-define': [0],
    '@typescript-eslint/no-use-before-define': [0],
  },
  parserOptions: {
    project: 'tsconfig.json',
  },
  settings: {
    polyfills: ['fetch', 'promises'],
  },
};
