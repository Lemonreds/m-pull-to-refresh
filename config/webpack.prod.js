const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prodConfig = {
  mode: 'production',
  entry: path.join(__dirname, '../example/app.js'),
  output: {
    path: path.join(__dirname, '../build/'),
    filename: 'm-pull-to-refresh.[hash:8].js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    clean: true,
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../document.ejs'),
    }),
    new MiniCssExtractPlugin({
      filename: 'm-pull-to-refresh.[hash:8].css',
    }),
  ],
  // externals: {
  //   react: {
  //     root: 'React',
  //     commonjs2: 'react',
  //     commonjs: 'react',
  //     amd: 'react',
  //   },
  //   'react-dom': {
  //     root: 'ReactDOM',
  //     commonjs2: 'react-dom',
  //     commonjs: 'react-dom',
  //     amd: 'react-dom',
  //   },
  // },
};

module.exports = prodConfig;
