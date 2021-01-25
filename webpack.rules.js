module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] },
  {
    test: /\.(scss|css)$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: { sourceMap: true, importLoaders: 1, modules: false },
      },
      { loader: "postcss-loader", options: { sourceMap: true } },
      { loader: "sass-loader", options: { sourceMap: true } },
    ],
  },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
  /**
   * Typescript Example:
   *
   * {
   *   test: /\.tsx?$/,
   *   exclude: /(node_modules|.webpack)/,
   *   loaders: [{
   *     loader: 'ts-loader',
   *     options: {
   *       transpileOnly: true
   *     }
   *   }]
   * }
   */
];
