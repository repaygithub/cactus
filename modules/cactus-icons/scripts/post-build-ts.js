const fs = require('fs').promises
const path = require('path')
const convertKebabToPascal = require('./helpers/kebabToPascal')

async function main() {
  let icons = await fs.readdir(path.join(__dirname, '..', 'ts'))
  icons = icons
    .filter((i) => i !== 'index.ts' && i.endsWith('.tsx'))
    .map((i) => {
      let base = path.basename(i, '.tsx')
      return [convertKebabToPascal(base), base]
    })
  const exports = []
  for (let [icon, iconFile] of icons) {
    exports.push(`export { default as ${icon} } from './${iconFile.toLowerCase()}'`)
  }
  exports.push('')
  await fs.writeFile(path.join(__dirname, '..', 'ts/icons.ts'), exports.join('\n'), 'utf8')
  const index = [
    "import * as icons from './icons'",
    "export * from './icons'",
    "export * from './types'",
    "export { default as AbstractIcon } from './AbstractIcon'",
    "export { default as iconSizes } from './iconSizes'",
    'export default icons',
  ]
  await fs.writeFile(path.join(__dirname, '..', 'ts/index.ts'), index.join('\n'), 'utf8')
}

main()
