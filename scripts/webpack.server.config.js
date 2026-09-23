const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
  entry: './server/index.ts',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  resolve: {
    mainFields: ['main'],
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: path.resolve(__dirname, '../tsconfig.server.json'),
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: './server/services/jest-manager/scripts', to: './scripts' },
      ],
    }),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
  ],
  externals: ['read-pkg-up', 'open'],
  node: {
    __dirname: false,
  },
});
