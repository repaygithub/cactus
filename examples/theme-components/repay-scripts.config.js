module.exports = (baseConfig, options) => {
  if (options.command === 'build') {
    // adds library bundles for cactus and react libraries
    baseConfig.optimization.splitChunks.cacheGroups = {
      cactus: {
        // Doesn't include node_modules because of yarn workspaces
        // symlinking. It normally should include node_modules like
        // react below
        test: /[\\/]cactus-/,
        name: 'cactus',
        chunks: 'all',
      },
      react: {
        // selects both react and react-dom into a separate bundle
        test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/,
        name: 'react',
        chunks: 'all',
      },
    }
  }
  return baseConfig
}
