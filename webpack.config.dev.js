const webpack = require('webpack');
const config = require('./webpack.config.common');
config.mode = "development";
config.devServer = {
    contentBase: __dirname,
    hot: true,
    publicPath: '/'
}
config.plugins.push(new webpack.HotModuleReplacementPlugin());
module.exports = config;