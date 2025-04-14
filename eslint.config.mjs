import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import oxlint from 'eslint-plugin-oxlint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import { globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  [globalIgnores(['dist/'])],
  eslint.configs.recommended,
  {
    rules: {
      'no-fallthrough': 'off',
    },
  },
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'], // needed for React 17+
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
    },
  },
  reactHooks.configs['recommended-latest'],
  eslintConfigPrettier,
  storybook.configs['flat/recommended'],
  oxlint.configs['flat/recommended'],
)
