module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        [
          require.resolve('@repay/babel-preset'),
          { coreJsPolyfill: true, regeneratorPolyfill: true, useHelpers: true },
        ],
      ],
    },
  })
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
