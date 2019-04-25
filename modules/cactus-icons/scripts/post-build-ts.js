const fs = require('fs').promises
const path = require('path')
const convertKebabToPascal = require('./helpers/kebabToPascal')

async function main() {
  let icons = await fs.readdir(path.join(__dirname, '..', 'ts'))
  icons = icons
    .filter(i => i !== 'index.ts' && i.endsWith('.tsx'))
    .map(i => {
      let base = path.basename(i, '.tsx')
      return [convertKebabToPascal(base), base]
    })
  let index = ''
  for (let [icon, iconFile] of icons) {
    index += `export { default as ${icon} } from './${iconFile.toLowerCase()}'\n`
  }
  await fs.writeFile(path.join(__dirname, '..', 'ts/index.ts'), index, 'utf8')

  // copy Svg.ts
  await fs.writeFile(
    path.join(__dirname, '..', 'ts/Svg.ts'),
    await fs.readFile(path.join(__dirname, '..', 'src/Svg.ts'), 'utf8'),
    'utf8'
  )
}

main()
