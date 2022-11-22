const remarkExternalLinks = import('remark-external-links')
const remarkSlug = import('remark-slug')

function createBabelOptions() {
  const jsxPlugin = [
    require.resolve('@babel/plugin-transform-react-jsx'),
    { pragma: 'React.createElement', pragmaFrag: 'React.Fragment' },
  ]

  return {
    babelrc: false,
    configFile: false,
    plugins: [jsxPlugin],
  }
}

module.exports = ({ config }) => {
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
          options: createBabelOptions(),
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
          options: createBabelOptions(),
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
