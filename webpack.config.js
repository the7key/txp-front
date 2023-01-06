const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");

/**
 * コマンド引数からの、ビルドタイプ指定時の定数
 */
const ENV = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
};

/**
 * webpackのmodeを取得
 */
const getWebpackMode = (mode) => {
  switch (mode) {
    case ENV.DEVELOPMENT:
      return "development";
    case ENV.STAGING:
      return "development";
    case ENV.PRODUCTION:
      return "production";
    default:
      throw new Error(`not found mode ${mode}`);
  }
};

/**
 * webpackのdevtoolを取得
 */
const getDevTool = (mode) => {
  switch (mode) {
    case ENV.DEVELOPMENT:
      return "eval-source-map";
    case ENV.STAGING:
      return "source-map";
    case ENV.PRODUCTION:
      return false;
    default:
      throw new Error(`not found mode ${mode}`);
  }
};

/**
 * envファイルのimport
 */
const getDotEnv = (mode) => {
  const load = (path) => {
    const result = dotenv.config({ path });
    if (result.error) {
      console.warn("warning:", result.error.message);
      return {};
    }
    return Object.fromEntries(
      Object.entries(result.parsed).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ])
    );
  };

  const baseEnv = load(path.join(__dirname, `.env.${mode}`));
  const localEnv = load(path.join(__dirname, `.env.${mode}.local`));
  const localGeneralEnv = load(path.join(__dirname, `.env.local`));

  return Object.assign({}, baseEnv, localEnv, localGeneralEnv, {
    "process.env": {},
  });
};

const printMessages = ({ mode, isDevServer }) => {
  console.log("====================");
  console.log("mode:   ", mode);
  console.log("devtool:", getDevTool(mode));
  console.log("command:", isDevServer ? "serve" : "build");
  console.log("====================");
};

const main = ({
  mode = ENV.DEVELOPMENT,
  port = "3000",
  analyze = false,
  isDevServer = false,
}) => {
  const isProduction = mode === ENV.PRODUCTION;

  printMessages({ mode, isDevServer });

  return {
    mode: getWebpackMode(mode),
    devtool: getDevTool(mode),
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "./build"),
      publicPath: "/",
      filename: "scripts/[name].[contenthash].js",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: isDevServer,
                getCustomTransformers: () => ({
                  before: [isDevServer && ReactRefreshTypeScript()].filter(
                    Boolean
                  ),
                }),
              },
            },
          ],
        },
        {
          test: /\.(jpg|png)$/,
          type: "asset/resource",
          generator: {
            filename: isProduction
              ? "images/[contenthash][ext]"
              : "images/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.(woff2|woff|ttf|svg|eot)$/,
          type: "asset/resource",
          generator: {
            filename: isProduction
              ? "fonts/[contenthash][ext]"
              : "fonts/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            // https://github.com/fomantic/Fomantic-UI/issues/2027 の修正が反映されるまでの対処
            {
              loader: "string-replace-loader",
              options: {
                search: "charset=utf-8;;base64",
                replace: "charset=utf-8;base64",
              },
            },
          ],
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                // 0 => no loaders (default);
                // 1 => postcss-loader;
                // 2 => postcss-loader, sass-loader
                importLoaders: 2,
                modules: {
                  localIdentName: isProduction
                    ? "[hash:base64:10]"
                    : "[name]_[local]_[hash:base64:5]",
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                // 設定は postcss.config.js
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                implementation: require("sass"),
                sassOptions: {
                  fiber: require("fibers"),
                },
              },
            },
          ],
        },
        {
          test: /[/\\]amazon-ivs-player[/\\].*dist[/\\]assets[/\\]/,
          loader: "file-loader",
          type: "javascript/auto",
          options: {
            name: "[name].[contenthash].[ext]",
            outputPath: "ivs",
          },
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    plugins: [
      new DefinePlugin(getDotEnv(mode)),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "index.html"),
        data: {
          PUBLIC_URL: "",
        },
      }),
      // clean build directory before building
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "./build/**/*")],
      }),
      // copy files to build directory
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public",
            to: "",
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
      // extracts CSS into separate files
      new MiniCssExtractPlugin({
        filename: isProduction
          ? "styles/[chunkhash].css"
          : "styles/[name].[chunkhash].css",
        ignoreOrder: true,
      }),
      analyze && new BundleAnalyzerPlugin(),
      isDevServer && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    devServer: {
      port,
      compress: true,
      hot: true,
      historyApiFallback: true,
      https: false,
      client: {
        overlay: true,
      },
      static: {
        directory: path.join(__dirname, "public"),
        watch: true,
      },
      proxy: {
        "/api": {
          target: "http://localhost",
        },
      },
    },
    target: "web",
    experiments: {
      syncWebAssembly: true,
    },
  };
};

module.exports = main({
  mode: process.env.BUILD_MODE,
  port: process.env.PORT,
  analyze: process.env.ANALYZE ? true : false,
  isDevServer: process.env.WEBPACK_SERVE ? true : false,
});
