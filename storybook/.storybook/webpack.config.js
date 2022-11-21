const remarkExternalLinks = import('remark-external-links')
const remarkSlug = import('remark-slug')

function createBabelOptions({ babelOptions, mdxBabelOptions, configureJSX }) {
  const babelPlugins = mdxBabelOptions?.plugins || babelOptions?.plugins || []

  const filteredBabelPlugins = babelPlugins.filter((p) => {
    const name = Array.isArray(p) ? p[0] : p
    if (typeof name === 'string') {
      return !name.includes('plugin-transform-react-jsx')
    }
    return true
  })

  const jsxPlugin = [
    require.resolve('@babel/plugin-transform-react-jsx'),
    { pragma: 'React.createElement', pragmaFrag: 'React.Fragment' },
  ]
  const plugins = configureJSX ? [...filteredBabelPlugins, jsxPlugin] : babelPlugins
  return {
    // don't use the root babelrc by default (users can override this in mdxBabelOptions)
    babelrc: false,
    configFile: false,
    ...babelOptions,
    ...mdxBabelOptions,
    plugins,
  }
}

module.exports = ({ config }) => {
  config.entry = [
    require.resolve('../../modules/cactus-web/dist/helpers/polyfills'),
    ...config.entry,
  ]
  const mdxLoader = require.resolve('@storybook/mdx2-csf/loader')
  const mdxLoaderOptions = {
    // whether to skip storybook files, useful for docs only mdx or md files
    skipCsf: true,
    remarkPlugins: [remarkSlug, remarkExternalLinks],
  }
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          [
            require.resolve('@repay/babel-preset'),
            { coreJsPolyfill: true, regeneratorPolyfill: true, useHelpers: true },
          ],
        ],
      },
    },
    {
      test: /(stories|story)\.mdx$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: createBabelOptions({ configureJSX: true }),
        },
        {
          loader: mdxLoader,
          options: {
            ...mdxLoaderOptions,
            skipCsf: false,
          },
        },
      ],
    },
    {
      test: /\.mdx$/,
      exclude: /(stories|story)\.mdx$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: createBabelOptions({ configureJSX: true }),
        },
        {
          loader: mdxLoader,
          options: mdxLoaderOptions,
        },
      ],
    },
  ]
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
