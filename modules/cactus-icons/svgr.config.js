const prettierConfig = JSON.parse(
  require('fs').readFileSync(require('path').join(__dirname, '../..', '.prettierrc'))
)
prettierConfig.parser = 'typescript'

const exportedTemplate = ({ template }, opts, { jsx, componentName }) => {
  const { name } = componentName
  const code = `
import React from 'react'
import AbstractIcon from './AbstractIcon'
import { SVGProps } from './types'

const Icon = React.forwardRef<SVGSVGElement, SVGProps>((props, svgRef) => (
  JSX
))
const ${name} = AbstractIcon.withComponent(Icon)
${name}.displayName = '${name}'

export default ${name}
`
  const typeScriptTpl = template.smart(code, {
    plugins: ['typescript'],
    preserveComments: true,
    placeholderPattern: /^[_A-Z]{2,}$/,
  })

  return typeScriptTpl({ JSX: jsx })
}

module.exports = {
  icon: true,
  ref: true,
  ext: 'tsx',
  template: exportedTemplate,
  svgProps: {
    fill: 'currentcolor',
  },
  prettierConfig,
}
