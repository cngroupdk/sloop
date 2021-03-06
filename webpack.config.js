var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new ExtractTextPlugin('bundle.css')
];

module.exports = {
  devtools: 'sourcemap',
  entry:  ['./src'],
  output: {
    path: 'builds',
    filename: 'bundle.js',
    publicPath: 'builds'
  },
  devServer: {
    hot: true
  },
  plugins: plugins,
  module: {
    loaders: [
      {
        test:   /\.js/,
        loader: 'babel',
        excluse: /builds|node_modules|server/,
        include: __dirname + '/src',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test: /\.html/,
        loader: 'html'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader'
      }
    ]
  }
};
