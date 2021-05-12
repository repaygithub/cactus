const commonjs = require('rollup-plugin-commonjs')

module.exports = (config) => {
  config.plugins.splice(
    1,
    1,
    commonjs({
      include: [/node_modules/],
      namedExports: {
        'react-is': ['ForwardRef', 'isElement', 'isValidElementType'],
      },
    })
  )
  return config
}
