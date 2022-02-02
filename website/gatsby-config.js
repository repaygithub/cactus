const path = require('path')
const modulesHelper = require('./tools/modules-helper')
const { default: cactusTheme } = require('@repay/cactus-theme')

module.exports = {
  siteMetadata: {
    title: 'Cactus Design System',
    author: 'REPAY',
    description: 'Cactus Design System and Framework documentation',
    keywords: ['typescript', 'react', 'styled-components', 'styled-system', ''].join(', '),
  },
  pathPrefix: '/cactus',
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        svgProps: {
          fill: 'currentcolor',
        },
      },
    },
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'docs',
        path: path.join(__dirname, '../docs'),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'components',
        path: modulesHelper.resolveModule('cactus-web/src/'),
        ignore: ['**/*.ts', '**/*.tsx', '**/*.json', '**/*.snap'],
      },
    },
    {
      resolve: 'gatsby-source-git',
      options: {
        name: 'cactus-web/v8',
        remote: 'https://github.com/repaygithub/cactus.git',
        branch: '@repay/cactus-web@8.1.0',
        patterns: 'modules/cactus-web/src/**/*.mdx',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.md', '.mdx'],
        gatsbyRemarkPlugins: [
          {
            resolve: require.resolve('./plugins/gatsby-remark-modify-links'),
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
            // copy over image files and optimize
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200,
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
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Cactus Design System',
        short_name: 'Cactus DS',
        icon: 'src/assets/cactus-with-fill.svg',
        start_url: '/',
        background_color: cactusTheme.colors.white,
        theme_color: cactusTheme.colors.base,
      },
    },
  ],
}
