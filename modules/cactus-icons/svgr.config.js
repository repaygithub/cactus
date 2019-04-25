const prettierConfig = JSON.parse(
  require('fs').readFileSync(require('path').join(__dirname, '../..', '.prettierrc'))
)
prettierConfig.parser = 'typescript'

const template = ({ template }, opts, { componentName, jsx }) => {
  const typeScriptTpl = template.smart({ plugins: ['typescript'] })

  // convert standard svg to use Svg component instead
  jsx.openingElement.name.name = 'Svg'
  jsx.closingElement.name.name = 'Svg'

  return typeScriptTpl.ast`
import * as React from 'react'
import { SpaceProps } from 'styled-system'
import Svg from './Svg'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'ref'>, SpaceProps {}

const ${componentName} = (props: Props) => (
  ${jsx}
)

export default ${componentName}
`
}

module.exports = {
  icon: true,
  ext: 'tsx',
  template,
  svgProps: {
    fill: 'currentcolor',
  },
}
