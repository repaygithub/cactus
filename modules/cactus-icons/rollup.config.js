module.exports = config => {
  config.output.shift()
  config.plugins.splice(3, 1)
  return config
}
