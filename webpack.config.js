const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: path.resolve('src/'),
    devServer: {
        hot: true
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
    entry: {
        main: path.resolve('src/index.js')
    },
    output: {
        path: path.resolve('dist/'),
        filename: 'bundle.js'
    },
    plugins: [new HtmlWebpackPlugin()],
}