const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

//! Development workflow
module.exports = {
	mode: "production",
	entry: "./src/app.ts", // root-entry to the project
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	devServer: "none",
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
