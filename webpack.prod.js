const path = require('path');

const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
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
  plugins: [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })],
  output: {
    filename: '[name].[contenthash].js',
  },
});
