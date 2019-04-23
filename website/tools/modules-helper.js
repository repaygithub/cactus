const path = require('path')
const fs = require('fs')

function resolveModule(...paths) {
  return path.resolve(__dirname, '../../modules', ...paths)
}

function hasStorybook(pkg) {
  return fs.existsSync(resolveModule(pkg.dirname, '.storybook'))
}

// modules cache
let allModules = null
function getModules() {
  if (allModules !== null) {
    return allModules
  }
  // gather module metadata
  const moduleDirs = fs.readdirSync(resolveModule())
  const packages = moduleDirs.map(dirname => {
    return JSON.parse(fs.readFileSync(resolveModule(dirname, 'package.json')))
  })
  allModules = packages.map((pkg, index) => {
    pkg.dirname = moduleDirs[index]
    pkg.hasStorybook = hasStorybook(pkg)
    return pkg
  })
  return allModules
}

module.exports = {
  resolveModule,
  getModules,
}
