const { exec: originalExec } = require('child_process')
const exec = require('util').promisify(originalExec)
const modulesHelper = require('./modules-helper')

module.exports = {
  async build(pkg) {
    if (pkg.hasStorybook === true) {
      await exec('yarn build-storybook -c .storybook -o ./.storybook/dist --quiet', {
        cwd: modulesHelper.resolveModule(pkg.dirname),
      })
    } else {
      console.warn(`Not building ${pkg.name} module because it does not have storybook`)
    }
  },
  find(packages) {
    if (!Array.isArray(packages) || packages.length === 0) {
      packages = modulesHelper.getModules()
    }
    return packages.filter(p => p.hasStorybook)
  },
}
