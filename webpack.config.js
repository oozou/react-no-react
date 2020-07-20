const path = require("path");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StatsPlugin = require("stats-webpack-plugin");

const entries = require("./.tmp/entries");

module.exports = {
  entry: {
    ...entries,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist/assets"),
    publicPath: "/assets/",
    filename: "[name]-[contenthash].js",
  },
  mode: "production",
  target: "web",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new StatsPlugin("../../.tmp/webpack-stats.json"),
  ],
};
