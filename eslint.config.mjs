// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'eqeqeq': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn'
    }
  },
  {
    ignores: ['node_modules/', 'dist/']
  }
);
