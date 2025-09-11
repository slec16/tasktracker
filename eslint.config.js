import globals from 'globals'; 
import tsParser from '@typescript-eslint/parser'; 
import tsPlugin from '@typescript-eslint/eslint-plugin'; 
import reactPlugin from 'eslint-plugin-react'; 
import reactHooks from 'eslint-plugin-react-hooks'


export default [
  {
    ignores: [
      '**/dist/**', 
      '**/coverage/**',
      'vite.config.*', 
      '*.config.js',
      '*.config.ts'
    ]
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest', 
      sourceType: 'module', 
      globals: {
        ...globals.browser, 
        ...globals.node 
      },
      parser: tsParser, 
      parserOptions: {
        project: true, 
        tsconfigRootDir: import.meta.dirname 
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,

    },
    rules: {
      'no-unused-vars': 'off', 
      'semi': ['error', 'never'],
      'no-console': ['error', {
        allow: ['error', 'warn']
      }],

      '@typescript-eslint/no-unused-vars': 'warn', 
      '@typescript-eslint/explicit-function-return-type': 'off',

      'react/react-in-jsx-scope': 'off', 
      'react/jsx-uses-react': 'error', 
      'react/jsx-uses-vars': 'error', 

      'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn', 
    
    },
    settings: {
      react: {
        version: 'detect' 
      },
      
    }
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', 
      '@typescript-eslint/consistent-type-imports': 'error' 
    }
  }
];