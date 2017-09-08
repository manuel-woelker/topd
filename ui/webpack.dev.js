const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: "./src/",
		inline: true,
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				secure: false
			}
		}
	}
});
