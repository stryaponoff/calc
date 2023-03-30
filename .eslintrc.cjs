module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    'indent': ['error', 2, { SwitchCase: 1 }],
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'semi': 'off',
    'quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/no-shadow': ['error'],
    'no-shadow': 'off',
    'no-undef': 'off',
    'keyword-spacing': 'error',
    'switch-colon-spacing': 'error',
    '@typescript-eslint/explicit-member-accessibility': ['error', {
      accessibility: 'explicit',
      overrides: {
        accessors: 'explicit',
        constructors: 'no-public',
        methods: 'explicit',
        properties: 'explicit',
        parameterProperties: 'explicit',
      },
    }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
}
