module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true
      },
    ],
    eqeqeq: ['error', 'always'],
    camelcase: 'error',
    quotes: ['error', 'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],

    'react/react-in-jsx-scope': 'never',

    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-shadow': [
      'off',
      {
        ignoreTypeValueShadow: true,
        ignoreFunctionTypeParameterNameValueShadow: true,
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
      }
    ],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
        readonly: 'array-simple',
      }
    ],
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/quotes': ['error', 'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
