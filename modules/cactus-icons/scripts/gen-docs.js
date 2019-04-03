const fs = require('fs').promises
const path = require('path')
const convertKebabToPascal = require('./helpers/kebabToPascal')

async function main() {
  let svgs = await fs.readdir(path.join(__dirname, '..', 'svgs'))
  let icons = svgs.map(i => {
    let base = path.basename(i, '.svg')
    return [convertKebabToPascal(base), base]
  })

  let markdown =
    `# Available Icons

<div style="display:flex;flex-wrap:wrap;">
  `.trim() + '\n'
  for (let [icon, filename] of icons) {
    markdown += `  <figure
    style="display:flex;justify-content:center;flex-direction:column;align-items:center;"
  >
    <img src="../../modules/cactus-icons/svgs/${filename}.svg"
      style="width:100px;"
      alt="svg for ${icon}" />
    <figcaption style="width: 150px;text-align:center;font-size:14px;">
      <div style="white-space:nowrap;">${filename}</div>
      <div>${icon}</div>
    </figcaption>
  </figure>\n`
  }
  markdown += '</div>\n'
  await fs.writeFile(
    path.join(process.cwd(), '../..', 'docs/Icons/Available_Icons.md'),
    markdown,
    'utf8'
  )
}

main()
