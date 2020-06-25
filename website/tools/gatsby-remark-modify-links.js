const path = require('path')
const visit = require('unist-util-visit')

const isInDocs = (url, dirname) => path.resolve(dirname, url).includes('/docs/')

const prependRelativePath = (url, dirname) => {
  const regex = new RegExp(/\/docs\/([\w\/]+)/)
  const match = regex.exec(dirname)
  return match.length === 2 ? `${match[1]}/${url}` : url
}

const toSlug = (filePath) =>
  filePath
    .toLowerCase()
    .replace(/(\s|%20)/, '-')
    .replace(/\.mdx?$/, '/')
    .replace(/readme\/$/, '')

module.exports = ({ markdownAST, markdownNode }, { repoBase, repoUrl }) => {
  visit(markdownAST, `link`, (node) => {
    if (
      node.url &&
      // relative path
      (node.url.startsWith('.') ||
        // relative file
        (/^[a-zA-Z0-9]/.test(node.url) && !node.url.startsWith('http')))
    ) {
      let dirname = path.dirname(markdownNode.fileAbsolutePath)
      // all docs are converted to pages
      if (isInDocs(node.url, dirname)) {
        node.url = node.url.replace(/^\.\//, '')
        node.url = prependRelativePath(node.url, dirname)
        node.url = toSlug(node.url)
      } else {
        // reference to repository url
        node.url = path.normalize(path.resolve(dirname, node.url)).replace(repoBase, repoUrl)
      }
    }
  })
}
