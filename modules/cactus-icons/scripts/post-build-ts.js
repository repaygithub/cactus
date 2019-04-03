const fs = require('fs').promises
const path = require('path')
const convertKebabToCamel = require('./helpers/kebabToPascal')

async function main() {
  let icons = await fs.readdir(path.join(__dirname, '..', 'built'))
  icons = icons
    .filter(i => i !== 'index.ts' && i.endsWith('.tsx'))
    .map(i => {
      let base = path.basename(i, '.tsx')
      return [convertKebabToCamel(base), base]
    })
  let index = ''
  for (let [icon, iconFile] of icons) {
    index += `export { default as ${icon} } from './${iconFile}'\n`
  }
  await fs.writeFile(path.join(__dirname, '..', 'built/index.ts'), index, 'utf8')

  // copy Svg.ts
  await fs.writeFile(
    path.join(__dirname, '..', 'built/Svg.ts'),
    await fs.readFile(path.join(__dirname, '..', 'src/Svg.ts'), 'utf8'),
    'utf8'
  )
}

main()
