var webpack = require("webpack");

module.exports = {
	entry: './js/main.js',
	output: {
		path: './',
		filename: 'bundle.js',
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			'query': {
				'plugins': ['lodash'],
				'presets': ['es2015']
			}
		}]
	}
};