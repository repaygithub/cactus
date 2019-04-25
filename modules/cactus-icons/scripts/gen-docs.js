const fs = require('fs').promises
const path = require('path')
const convertKebabToPascal = require('./helpers/kebabToPascal')
const fg = require('fast-glob')

const CWD = process.cwd()

async function main() {
  let svgs = await fg(['./svgs/**/*.svg'])
  svgs.sort()
  let icons = svgs.map(filePath => {
    filePath = filePath.replace('./svgs/', '').replace('.svg', '')
    let fileName = filePath
      .split('/')
      .join('-')
      .toLowerCase()
    // [icon component name, fileName, filePath]
    return [convertKebabToPascal(fileName), fileName, filePath]
  })

  let markdown =
    `# Available Icons

<div style="display:flex;flex-wrap:wrap;">
  `.trim() + '\n'
  for (let [componentName, fileName, filePath] of icons) {
    markdown += `  <figure
    style="display:flex;justify-content:center;flex-direction:column;align-items:center;"
  >
    <img src="../../modules/cactus-icons/svgs/${filePath}.svg"
      style="width:100px;"
      alt="svg for ${componentName}" />
    <figcaption style="min-width: 150px;text-align:center;font-size:14px;">
      <code style="white-space:pre-wrap;font-size:10px;">/i/${fileName}</code>
      <div>${componentName}</div>
    </figcaption>
  </figure>\n`
  }
  markdown += '</div>\n'
  await fs.writeFile(path.join(CWD, '../..', 'docs/Icons/Available Icons.md'), markdown, 'utf8')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
