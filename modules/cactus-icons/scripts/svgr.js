const fg = require('fast-glob')
const svgr = require('@svgr/core').default
const path = require('path')
const fs = require('fs').promises
const configFile = require('../svgr.config')
const prettier = require('prettier')

async function main() {
  // Find all svgs under the svgs folder
  const svgFiles = await fg(['./svgs/**/*.svg'])

  try {
    await fs.access(path.resolve(__dirname, '../ts'))
  } catch {
    await fs.mkdir(path.resolve(__dirname, '../ts'))
  }

  svgFiles.forEach(async svgFile => {
    // Extract the code from all of the files
    const svgCode = await fs.readFile(path.join(__dirname, '..', svgFile))
    const tsxFileName = svgFile
      .replace('./svgs/', '')
      .replace('.svg', '')
      .split('/')
      .join('-')
      .toLowerCase()

    const prettierConfig = await fs.readFile(path.join(__dirname, '../../..', '.prettierrc'))
    prettierConfig.parser = 'typescript'

    // Generate React components for each svg
    svgr(svgCode, configFile).then(async tsxCode => {
      const code = prettier.format(tsxCode, prettierConfig)
      // Write the components to files in the ts directory
      await fs.writeFile(path.join(__dirname, '..', `ts/${tsxFileName}.tsx`), code, 'utf-8')
    })
  })
}

main()
