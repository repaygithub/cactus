const prettierConfig = JSON.parse(
  require('fs').readFileSync(require('path').join(__dirname, '../..', '.prettierrc'))
)
prettierConfig.parser = 'typescript'

const template = ({ template }, opts, { componentName, jsx }) => {
  const typeScriptTpl = template.smart({ plugins: ['typescript'] })

  return typeScriptTpl.ast`
import * as React from 'react'
import {
  color,
  ColorProps,
  get,
  px,
  space,
  SpaceProps,
  style,
} from 'styled-system'
import styled from 'styled-components'

type IconSizes = 'tiny' | 'small' | 'medium' | 'large'
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'color'>, SpaceProps, ColorProps {
  iconSize?: IconSizes
  color?: string
}

const iconSizes = style({
  prop: 'iconSize',
  cssProperty: 'fontSize',
  key: 'iconSizes',
  transformValue: (size, scale) => px(get(scale, size)),
})

const Base = (props: Props) => (
  ${jsx}
)

const ${componentName} = styled(Base)\`
  vertical-align: middle;
  \${space}
  \${color}
  \${iconSizes}
\`

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
