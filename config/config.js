'use strict';
const path = require('path');

module.exports = {
  dev: {
    assetsPublicPath: '/',
    proxyTable: {},
    host: 'localhost',
    port: 8000,
    autoOpenBrowser: false,
    devtool: 'cheap-module-eval-source-map',
  },
  build: {
    assetsPublicPath: './',
    assetsRoot: path.resolve(__dirname, '..', 'dist'),
  },
};
