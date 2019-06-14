'use strict';
const path = require('path');

module.exports = {
  dev: {
    assetsPublicPath: '/',
    proxyTable: {},
    // 设置为 0.0.0.0 可让外部访问
    host: 'localhost',
    port: 8000,
    autoOpenBrowser: false,
    devtool: 'cheap-module-eval-source-map',
  },
  build: {
    assetsPublicPath: './',
    assetsRoot: path.resolve(__dirname, '..', 'dist'),
    bundleAnalyzerReport: false,
  },
};
