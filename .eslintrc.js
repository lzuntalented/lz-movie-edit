module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx', 'ts', '.tsx'],
    }],
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-no-useless-fragment': 0,
    'no-unused-vars': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-shadow': 0,
  },
};
