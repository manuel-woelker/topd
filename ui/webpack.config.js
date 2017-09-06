const path = require('path');
const webpack = require("webpack");

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, '../src/assets'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{test: /\.[jt]sx?$/, use: 'awesome-typescript-loader', exclude: /node_modules/},
			{test: /\.css$/, loader: "style-loader!css-loader"},
			{test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
			{test: /\.ttf$/, loader: "file-loader"},
			{test: /\.eot$/, loader: "file-loader"},
			{test: /\.svg$/, loader: "file-loader"}

		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			React: "react",
			ReactDOM: "react-dom"

		})
	],
	devServer: {
		contentBase: "./src/",
		inline: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				secure: false
			}
		}}
};
