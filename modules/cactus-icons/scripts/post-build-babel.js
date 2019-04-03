const fs = require('fs').promises
const path = require('path')

async function copyToDist(localPath) {
  return fs.writeFile(
    path.join(process.cwd(), localPath),
    await fs.readFile(path.join(process.cwd(), 'dist', localPath), 'utf8'),
    'utf8'
  )
}

// copies necessary files to dist for publish
async function main() {
  await copyToDist('package.json')
  await copyToDist('README.md')
}

main()
