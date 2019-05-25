const path = require('path');

module.exports = {
  presets: ['@babel/env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    [
      'module-resolver',
      {
        alias: {
          '@': path.join(__dirname, 'src'),
        },
      },
    ],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, // or 'css'
      },
    ],
  ],
};
