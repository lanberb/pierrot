import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.resolve(path.dirname(""));

export default {
  devServer: {
    static: "dist",
    open: true,
    port: 8000,
  },
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
    ],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "main.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "hello react",
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  target: ["web", "es5"],
};
