const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } }
    ]
  },
  entry: {
    app: './src/root.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin([
      path.resolve(__dirname, 'css', '*.css')
    ]),
    new HtmlWebpackPlugin({
      title: 'abfahrten.berlin',
      template: path.resolve(__dirname, 'index.html'),
      filename: path.resolve(__dirname, 'dist', 'index.html')
    })
  ]
};

