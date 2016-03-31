var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new ExtractTextPlugin('bundle.css')
];

module.exports = {
  devtools: 'sourcemap',
  entry:  ['webpack/hot/dev-server', './src'],
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
        excluse: /node_modules/,
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
        test: /\.svg/,
        loader: 'svg-url-loader'
      }
    ]
  }
};
