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
  allModules = []
  for (let i = 0; i < moduleDirs.length; i++) {
    const dirname = moduleDirs[i]
    const packagePath = resolveModule(dirname, 'package.json')
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath))
      pkg.dirname = dirname
      pkg.hasStorybook = hasStorybook(pkg)
      allModules.push(pkg)
    }
  }

  return allModules
}

module.exports = {
  resolveModule,
  getModules,
}
