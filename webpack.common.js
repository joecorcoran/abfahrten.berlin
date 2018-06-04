const path = require('path');

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
  }
};

