const config = require('../../config.js')

function managerEntries(entry = []) {
  return [...entry, require.resolve('./preview')] //👈 Addon implementation
}

async function managerWebpack(webpackConfig = {}) {
  return config({ config: webpackConfig })
}

module.exports = { managerEntries, managerWebpack }
