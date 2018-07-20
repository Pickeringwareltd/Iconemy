const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    token: './app_server/web3_addons/token_web3.js',
    crowdsale: './app_server/web3_addons/capped_crowdsale_web3.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public/javascripts/web3/'
  }
  // module: {
  //   rules: [
  //     {
  //      test: /\.css$/,
  //      use: [ 'style-loader', 'css-loader' ]
  //     }
  //   ]
  // }
}
