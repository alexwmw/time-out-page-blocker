const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/extension-scripts/background.js",
    content: "./src/extension-scripts/content.js",
    options: "./src/Options.js",
    update: "./src/Update.js",
    app: "./src/App.js",
    "page-block": "./src/PageBlock.js",
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management",
      template: "./src/app.html",
      chunks: ["app"],
    }),
    new HtmlWebpackPlugin({
      title: "Options",
      template: "./src/options.html",
      filename: "options.html",
      chunks: ["options"],
    }),
    new HtmlWebpackPlugin({
      title: "Update",
      template: "./src/update.html",
      filename: "update.html",
      chunks: ["update"],
    }),
    new HtmlWebpackPlugin({
      title: "Page block",
      template: "./src/page-block.html",
      filename: "page-block.html",
      chunks: ["page-block"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/manifest.json"), to: "." },
        { from: path.resolve(__dirname, "src/css"), to: "css" },
        { from: path.resolve(__dirname, "src/icons"), to: "icons" },
        { from: path.resolve(__dirname, "src/images"), to: "images" },
      ],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // toggle this
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, "src"),
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: path.resolve(__dirname, "src"),
        use: ["file-loader"],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
