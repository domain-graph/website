const path = require('path');

const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: { directory: path.join(__dirname, 'build/dist') },
    port: 9000,
    hot: true,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              additionalData:
                "@import '/node_modules/domain-graph/lib/colors.less';",
            },
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[name].css' })],
  output: {
    filename: '[name].js',
  },
});
