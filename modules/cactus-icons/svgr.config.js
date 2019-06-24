const prettierConfig = JSON.parse(
  require('fs').readFileSync(require('path').join(__dirname, '../..', '.prettierrc'))
)
prettierConfig.parser = 'typescript'

const template = ({ template }, opts, { componentName, jsx }) => {
  const code = `
import PropTypes from 'prop-types'
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
export interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'color'>, SpaceProps, ColorProps {
  iconSize?: IconSizes
  color?: string
}

const iconSizes = style({
  prop: 'iconSize',
  cssProperty: 'fontSize',
  key: 'iconSizes',
  transformValue: (size, scale) => px(get(scale, size)),
})

const Base = ({ iconSize, ...props }: Props) => (
  JSX
)

const COMPONENT_NAME = styled(Base)\`
  vertical-align: middle;
  \${space}
  \${color}
  \${iconSizes}
\`

TS_IGNORE
COMPONENT_NAME.propTypes = {
  iconSize: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
}

export default COMPONENT_NAME
  `
  const typeScriptTpl = template.smart(code, {
    plugins: ['typescript'],
    preserveComments: true,
    placeholderPattern: /^[_A-Z]{2,}$/,
  })

  return typeScriptTpl({ JSX: jsx, COMPONENT_NAME: componentName, TS_IGNORE: '// @ts-ignore' })
}

module.exports = {
  icon: true,
  ext: 'tsx',
  template,
  svgProps: {
    fill: 'currentcolor',
  },
  prettierConfig,
}
