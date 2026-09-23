const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
  entry: './ui/index.tsx',
  mode: env.production ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, '../dist/ui'),
    filename: 'ui.bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    static: path.resolve(__dirname, '../dist/ui'),
    hot: true,
    port: 9000,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Majestic',
      template: path.resolve(__dirname, '../ui/index.html'),
      favicon: './ui/assets/favicon.ico',
    }),
    new webpack.DefinePlugin({
      PRODUCTION: env.production === true,
    }),
  ],
});
