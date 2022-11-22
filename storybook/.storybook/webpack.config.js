const webpackConfig = require('../config.js')

module.exports = async ({ config }) => {
  return webpackConfig({ config })
}
