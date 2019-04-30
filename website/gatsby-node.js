const path = require('path')
const crypto = require('crypto')
const fg = require('fast-glob')
const reactDocgenTs = require('react-docgen-typescript')
const { createFilePath } = require('gatsby-source-filesystem')
const modulesHelper = require('./tools/modules-helper')

const digest = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const GenericTemplate = path.resolve('src/templates/GenericTemplate.tsx')
  const ComponentTemplate = path.resolve('src/templates/ComponentTemplate.tsx')

  return graphql(`
    {
      allMdx {
        edges {
          node {
            id
            parent {
              ... on File {
                name
                sourceInstanceName
              }
            }
            fields {
              title
              slug
              isComponent
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const edges = result.data.allMdx.edges

    // Create pages:
    edges.forEach(({ node }) => {
      const { fields } = node
      createPage({
        path: fields.slug,
        component: fields.isComponent ? ComponentTemplate : GenericTemplate,
        context: {
          slug: fields.slug,
        },
      })
    })
  })
}

function toSlug(filePath, options) {
  let formatted = filePath
    .toLowerCase()
    .replace(/(\s|%20)/g, '-')
    .replace(/readme\/$/, '')
  if (options.isComponent) {
    formatted = path.join('/components', formatted.split('/')[1] + '/')
  }
  return formatted
}

function getTitle({ node, getNode }) {
  let title = node.frontmatter.title
  if (!title) {
    // try to pull from markdown
    let fromMd = node.rawBody.match(/(^#|\s#) ([^\n\r]+)/)
    if (fromMd !== null) {
      title = fromMd[2]
    } else {
      // use name of document
      title = getNode(node.parent).name
    }
  }
  return title
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const isComponent = getNode(node.parent).sourceInstanceName === 'components'
    createNodeField({
      name: 'slug',
      node,
      value: toSlug(createFilePath({ node, getNode }), { isComponent }),
    })
    createNodeField({
      name: 'isComponent',
      node,
      value: isComponent,
    })
    createNodeField({
      name: 'title',
      node,
      value: getTitle({ node, getNode }),
    })
  }
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        'styled-components': path.resolve('../node_modules/styled-components'),
        'website-src': path.resolve('./src'),
      },
    },
  })
}

exports.onCreateBabelConfig = ({ actions }) => {
  // required for docz
  actions.setBabelPlugin({
    name: 'babel-plugin-export-metadata',
  })
}

const docgen = reactDocgenTs.withCustomConfig(
  modulesHelper.resolveModule('cactus-web/tsconfig.json'),
  []
)

exports.sourceNodes = async ({ actions, createNodeId }) => {
  const { createNode } = actions

  const componentPaths = await fg([
    modulesHelper.resolveModule('cactus-web/src/[A-Z]*/[A-Z]*.tsx'),
    '!' + modulesHelper.resolveModule('cactus-web/src/[A-Z]*/[A-Z]*.test.tsx'),
    '!' + modulesHelper.resolveModule('cactus-web/src/[A-Z]*/[A-Z]*.story.tsx'),
  ])
  const props = await Promise.all(
    componentPaths.map(filePath => {
      const doc = docgen.parse(filePath)
      return { key: path.relative(__dirname, filePath), value: doc }
    })
  )

  const stringified = JSON.stringify(props || [])
  const contentDigest = digest(stringified)

  createNode({
    id: createNodeId('docgen-data'),
    db: stringified,
    children: [],
    internal: {
      contentDigest,
      type: 'DocgenDB',
    },
  })
}
