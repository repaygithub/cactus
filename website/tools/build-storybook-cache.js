#!/usr/bin/env node

const storybookHelper = require('./storybook-helper')
const path = require('path')
const { promises: fs } = require('fs')

async function main() {
  const modules = storybookHelper.find()
  const storybooks = modules.map((m) => {
    return {
      name: m.name,
      dirname: m.dirname,
    }
  })
  await fs.writeFile(
    path.resolve(__dirname, '../src/storybook-config.json'),
    JSON.stringify(storybooks, null, 2),
    'utf8'
  )
}

main()
