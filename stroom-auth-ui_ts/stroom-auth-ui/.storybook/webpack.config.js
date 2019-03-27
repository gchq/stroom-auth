const path = require("path");
//const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");

// Export a function. Accept the base config as the only param.
module.exports = ({ config, mode }) => {
  // mode has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // FIXME: this is failing for some reason, and that means some styles aren't getting loaded.
  // Make whatever fine-grained changes you need
  // config.module.rules.push({
  //   test: /\.(css)$/,
  //   loaders: ["style-loader", "css-loader"],
  //   include: path.resolve(__dirname, "../")
  // });

  // Remove old rules
  config.module.rules = config.module.rules.filter(
    item =>
      !(
        item.test &&
        typeof item.test === "object" &&
        item.test.test &&
        (item.test.test("t.svg") || item.test.test("t.png"))
      )
  );

  // Updated image rule from a git forum
  config.module.rules.push({
    test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
    loader: require.resolve("file-loader"),
    query: {
      name: "static/media/[name].[hash:8].[ext]"
    }
  });

  // This stuff also stopped working in SB4
  // // Fonts
  // config.module.rules.push({
  //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  //   loader: "url-loader?limit=10000&mimetype=application/font-woff",
  //   query: {
  //     name: "static/media/files/[name].[hash:8].[ext]"
  //   }
  // });
  // config.module.rules.push({
  //   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  //   loader: "file-loader",
  //   query: {
  //     name: "static/media/fonts/[name].[hash:8].[ext]"
  //   }
  // });
  // // Load images.
  // config.module.rules.push({
  //   test: /\.(gif|jpe?g|png)$/,
  //   loader: "url-loader?limit=25000",
  //   query: {
  //     limit: 10000,
  //     name: "static/media/images/[name].[hash:8].[ext]"
  //   }
  // });

  //TODO: couldn't get this working with Storybook 4, but everything seems fine without it.
  // Leaving it here until we're sure it's not needed.
  // json Loader
  // config.module.rules.push({
  // test: /\.json$/,
  // loader: "json-loader"
  // });

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, "../src"),
    loader: require.resolve("ts-loader")
  });
  //config.plugins.push(new TSDocgenPlugin()); // optional
  config.resolve.extensions.push(".ts", ".tsx");

  // Return the altered config
  return config;
};
