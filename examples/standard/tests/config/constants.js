const path = require('path')
const os = require('os')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = { DIR }
