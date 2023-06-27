module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-multiple-empty-lines': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    indent: 'off',
    'linebreak-style': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-constant-condition': ['error', { 'checkLoops': false }]
  },
};
