// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactCompiler from 'eslint-plugin-react-compiler'
import pluginReact from 'eslint-plugin-react'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  {
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
  },
  pluginReact.configs.flat['jsx-runtime'],
  // @ts-expect-error - eslint-plugin-react-compiler is not typed
  reactCompiler.configs.recommended,
  {
    ignores: [
      '.parcel-cache',
      'dist',
      'node_modules',
      'coverage',
      '__mocks__',
      'jest.config.cjs',
    ],
  },
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  }
)
