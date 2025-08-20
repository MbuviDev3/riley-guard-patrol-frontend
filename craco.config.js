// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the source-map-loader rule and exclude node_modules
      const sourceMapLoaderRule = webpackConfig.module.rules.find(
        (rule) =>
          rule.enforce === "pre" &&
          rule.use &&
          rule.use.loader === "source-map-loader"
      );
      if (sourceMapLoaderRule) {
        sourceMapLoaderRule.exclude = /node_modules/;
      }
      return webpackConfig;
    },
  },
};
