const path = require('path')

module.exports = {
  siteMetadata: {
    title: 'Cactus Docs',
    author: 'REPAY',
    description: 'Cactus Design System and Framework documentation',
    keywords: ['typescript', 'react', 'styled-components', 'styled-system', ''].join(', '),
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-catch-links',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'docs',
        path: path.join(__dirname, '../docs'),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-mdx',
      options: {
        extensions: ['.md', '.mdx'],
        gatsbyRemarkPlugins: [
          {
            resolve: path.resolve('./tools/gatsby-remark-modify-links.js'),
            options: {
              repoBase: path.resolve('../'),
              repoUrl: 'https://github.com/repaygithub/cactus/tree/master',
            },
          },
          {
            // replaces dumb special characters with nice ones
            resolve: 'gatsby-remark-smartypants',
            options: {
              dashes: 'oldschool',
            },
          },
          {
            // styling for code blocks
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: {
                tsx: 'tsx',
              },
              aliases: {},
            },
          },
          {
            // copy over image files and optimize
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200,
              sizeByPixelDensity: true,
            },
          },
          {
            // copy other than [`png`, `jpg`, `jpeg`, `bmp`, `tiff`]
            resolve: 'gatsby-remark-copy-linked-files',
            options: {},
          },
        ],
      },
    },
    // TODO review and add the following if desired
    // 'gatsby-plugin-lunr',
    // 'gatsby-plugin-feed',
    // 'gatsby-plugin-manifest',
  ],
}
