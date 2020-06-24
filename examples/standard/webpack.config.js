const path = require('path')

module.exports = function (config) {
  // ensure react resolves to a single location
  config.resolve.alias.react = path.resolve('../..', 'node_modules', 'react')

  return config
}
