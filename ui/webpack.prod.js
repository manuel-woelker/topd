const webpack = require("webpack");
const merge = require('webpack-merge');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

const common = require('./webpack.common.js');

module.exports = merge(common, {
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			uglifyOptions: {
				ecma: 7
			}
		}),
		new CompressionPlugin({
			test: /\.js$/,
			minRatio: 2.0
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
});
