const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const GenericTemplate = path.resolve('src/templates/GenericTemplate.tsx')

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

    // Create single content pages:
    edges.forEach(({ node }) => {
      const { fields } = node
      createPage({
        path: fields.slug,
        component: GenericTemplate,
        context: {
          slug: fields.slug,
        },
      })
    })
  })
}

function toSlug(path) {
  return path
    .toLowerCase()
    .replace(/(\s|%20)/g, '-')
    .replace(/readme\/$/, '')
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
    createNodeField({
      name: 'slug',
      node,
      value: toSlug(createFilePath({ node, getNode })),
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
        'styled-components': path.resolve('node_modules/styled-components'),
      },
    },
  })
}
