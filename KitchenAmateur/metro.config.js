const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('sqlite')
module.exports = config;

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig(__dirname);
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-css-transformer")
    },
    resolver: {
      sourceExts: [...sourceExts, "css"]
    }
  };
})();