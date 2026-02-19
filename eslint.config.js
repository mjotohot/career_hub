import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'
import parserVue from 'vue-eslint-parser'
import parserTypeScript from '@typescript-eslint/parser'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx,ts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        sourceType: 'module',
      },
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        sourceType: 'module',
      },
    },
  },

  skipFormatting,
])
