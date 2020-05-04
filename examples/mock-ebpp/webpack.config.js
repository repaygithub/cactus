module.exports = function(config) {
  config.module.rules.push({
    test: /\.css$/i,
    use: {
      loader: require.resolve('css-loader'),
    },
  })

  return config
}
