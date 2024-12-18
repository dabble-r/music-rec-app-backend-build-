import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  { languageOptions: 
    { 
      globals: {
        ...globals.node 
      }
    }
  },
  {
    ignores: [
      'dist/**'
    ]
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'object-curly-spacing': [
        'error', 'always'
      ],
      '@stylistic/js/indent': [
        'error', 2
      ],
      '@stylistic/js/linebreak-style': [
        'error', 'unix'
      ],
      '@stylistic/js/quotes': [
        'error', 'single'
      ],
      '@stylistic/js/semi': [
        'error', 'never'
      ],
      'no-console': 'off'
    }, 
  } 
]