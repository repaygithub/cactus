module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [require.resolve('@repay/babel-preset')],
    },
  })
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
