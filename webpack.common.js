const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader' } }
    ]
  },
  resolve: { extensions: ['.js', '.jsx'] },
  entry: {
    app: ['babel-polyfill', 'whatwg-fetch', './src/root.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      path.resolve(__dirname, 'css', '*'),
      path.resolve(__dirname, 'webfonts', '*')
    ]),
    new HtmlWebpackPlugin({
      title: 'abfahrten.berlin',
      template: path.resolve(__dirname, 'index.html'),
      filename: path.resolve(__dirname, 'dist', 'index.html')
    })
  ]
};

