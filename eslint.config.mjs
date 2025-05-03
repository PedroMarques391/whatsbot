import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';


export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  { ignores: ['dist/', 'types/'] },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    }
  }
]);