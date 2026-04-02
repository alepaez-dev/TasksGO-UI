import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import noComponentState from './eslint-rules/no-component-state.js';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'custom-rules': {
        rules: {
          'no-component-state': noComponentState,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      'custom-rules/no-component-state': 'error',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
    },
  },
  {
    files: ['src/**/*.stories.{ts,tsx}'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },
  {
    files: ['src/**/*.d.ts'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },
  {
    files: ['e2e/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.e2e.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    ignores: ['dist/', 'storybook-static/', 'eslint-rules/'],
  },
);
