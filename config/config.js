"use strict";
const path = require("path");

module.exports = {
  dev: {
    assetsPublicPath: "/",
    assetsSubDirectory: "static",
    proxyTable: {},
    host: "localhost",
    port: 8000,
    autoOpenBrowser: false,
    devtool: "cheap-module-eval-source-map"
  },
  build: {
    assetsPublicPath: "./",
    assetsSubDirectory: "static",
    assetsRoot: path.resolve(__dirname, "..", "dist")
  }
};
