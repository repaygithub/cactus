const fg = require('fast-glob')
const svgr = require('@svgr/core').default
const path = require('path')
const fs = require('fs').promises
const { prettierConfig, ...configFile } = require('../svgr.config')
const prettier = require('prettier')
const convertKebabToPascal = require('./helpers/kebabToPascal')

async function main() {
  // Find all svgs under the svgs folder
  const svgFiles = await fg(['./svgs/**/*.svg'])
  const CWD = process.cwd()

  try {
    await fs.access(path.resolve(__dirname, '../ts'))
  } catch {
    await fs.mkdir(path.resolve(__dirname, '../ts'))
  }

  await fg(['./src/**/*.ts']).then((extraSources) =>
    Promise.all(
      extraSources.map((f) =>
        fs.copyFile(path.join(CWD, f), path.join(CWD, 'ts', f.replace('./src/', '')))
      )
    )
  )

  const allFiles = svgFiles.map(async (svgFile) => {
    // Extract the code from all of the files
    const svgCode = await fs.readFile(path.join(__dirname, '..', svgFile))
    const tsxFileName = svgFile
      .replace('./svgs/', '')
      .replace('.svg', '')
      .split('/')
      .join('-')
      .toLowerCase()

    // Generate React components for each svg
    const state = { componentName: convertKebabToPascal(tsxFileName) }
    const tsxCode = await svgr(svgCode, configFile, state)
    const code = prettier.format(tsxCode, prettierConfig)
    // Write the components to files in the ts directory
    await fs.writeFile(path.join(__dirname, '..', `ts/${tsxFileName}.tsx`), code, 'utf-8')
  })

  await Promise.all(allFiles)
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
