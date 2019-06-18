const path = require('path')
const { promises: fs } = require('fs')
const crypto = require('crypto')
const fg = require('fast-glob')
const reactDocgenTs = require('react-docgen-typescript')
const { createFilePath } = require('gatsby-source-filesystem')
const chokidar = require('chokidar')
const modulesHelper = require('./tools/modules-helper')

const digest = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

exports.createPages = ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions

  createRedirect({
    fromPath: `/design-system/`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/design-system/language/`,
  })
  createRedirect({
    fromPath: `/design-system`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/design-system/language/`,
  })

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

    // Create pages from all of the sourced markdown files
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
  /**
   * Required to match individual component files to their docgen data.
   * Adds a __filemeta property to all react components
   */

  actions.setBabelPlugin({
    name: 'babel-plugin-export-metadata',
  })
}

const docgen = reactDocgenTs.withCustomConfig(
  modulesHelper.resolveModule('cactus-web/tsconfig.json'),
  []
)
const DOCGEN_CACHE_KEY = 'cactus-docgen'

/**
 * Sources component files and creates a docgen object for each of them.
 * Adds the DocItem[] data to the graphql as type DocgenDB
 */
exports.sourceNodes = async ({ actions, createNodeId, cache }) => {
  const { createNode } = actions
  const componentGlobs = [
    modulesHelper.resolveModule('cactus-web/src/[A-Z]*/[A-Z]*.tsx'),
    '!' + modulesHelper.resolveModule('cactus-web/src/[A-Z]*/[A-Z]*.test.tsx'),
    '!' + modulesHelper.resolveModule('cactus-web/src/[A-Z]*/[A-Z]*.story.tsx'),
  ]

  /**
   * docgenData = DocItem[] where DocItem = { key: filepath, value: ComponentDoc }
   */
  let docgenData = await cache.get(DOCGEN_CACHE_KEY)
  if (!Array.isArray(docgenData)) {
    console.log('[DOCGEN] no cache')
    docgenData = []
  } else {
    console.log('[DOCGEN] cache found')
  }

  const createComponentDb = async filePath => {
    // initial sourcing
    if (filePath === undefined) {
      const componentPaths = await fg(componentGlobs.slice())
      const updatedDocgenData = []
      for (const filePath of componentPaths) {
        const key = path.relative(__dirname, filePath)
        const hashed = digest(await fs.readFile(filePath, 'utf8'))
        let previousData = docgenData.find(d => d.key === key)
        if (previousData && previousData.hashed === hashed) {
          updatedDocgenData.push(previousData)
        } else {
          const doc = docgen.parse(filePath)
          updatedDocgenData.push({ key, value: doc, hashed })
        }
      }
      docgenData = updatedDocgenData
    } else {
      const relativePath = path.relative(__dirname, filePath)
      const doc = docgen.parse(filePath)
      const previous = docgenData.find(d => d.key === relativePath)
      if (!previous) {
        docgenData.push({ key: relativePath, value: doc })
      } else {
        previous.value = doc
      }
    }

    const dataWithoutHash = docgenData.map(d => ({ key: d.key, value: d.value }))
    const stringified = JSON.stringify(dataWithoutHash)
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

    await cache.set(DOCGEN_CACHE_KEY, docgenData)
  }

  await createComponentDb()

  // add watcher for reloading
  chokidar
    .watch(componentGlobs.slice(), { ignoreInitial: true })
    .on('change', path => createComponentDb(path))
    .on('add', path => createComponentDb(path))
}
