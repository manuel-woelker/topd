const path = require('path');
const webpack = require("webpack");

module.exports = {
	entry: './src/main.tsx',
	output: {
		path: path.resolve(__dirname, '../src/assets'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{test: /\.tsx?$/, use: 'awesome-typescript-loader', exclude: /node_modules/},
			{test: /\.css$/, loader: "style-loader!css-loader"},
			{test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.ttf$/, loader: "file-loader"},
			{test: /\.eot$/, loader: "file-loader"},
			{test: /\.svg$/, loader: "file-loader"}

		]
	},
	devServer: {
		contentBase: "./src/",
		inline: true,
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				secure: false
			}
		}}
};
