#!/usr/bin/env node

const cpy = require('cpy')
const path = require('path')
const modulesHelper = require('./modules-helper')
const storybookHelper = require('./storybook-helper')

async function main() {
  const modules = modulesHelper.getModules()
  const storybooks = storybookHelper.find(modules)
  console.log('building storybook for modules:')
  // start building storybook
  const storybookBuilds = storybooks.map((pkg) => {
    console.log(`\t${pkg.name}`)
    return storybookHelper.build(pkg)
  })

  console.log('')
  const dist = path.resolve(__dirname, '../public')

  await Promise.all(storybookBuilds)
  console.log('finished building storybooks, copying into public dir')
  for (const pkg of modules) {
    console.log(`\tcopying files for ${pkg.name}`)
    await cpy(
      [modulesHelper.resolveModule(pkg.dirname, '.storybook/dist/*')],
      path.join(dist, 'stories', pkg.dirname)
    )
    await cpy(
      [modulesHelper.resolveModule(pkg.dirname, '.storybook/dist/sb_dll/*')],
      path.join(dist, 'stories', pkg.dirname, 'sb_dll')
    )
  }
  console.log('\nStories built!\n')
}

main()
