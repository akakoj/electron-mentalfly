const rules = require("./webpack.rules");
const CopyWebpackPlugin = require("copy-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  // Put your normal webpack config below here
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public",
          to: "assets",
          globOptions: {
            ignore: ["*.DS_Store"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  module: {
    rules,
  },
};
