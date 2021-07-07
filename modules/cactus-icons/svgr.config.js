const prettierConfig = JSON.parse(
  require('fs').readFileSync(require('path').join(__dirname, '../..', '.prettierrc'))
)
prettierConfig.parser = 'typescript'

const exportedTemplate = ({ template }, opts, { componentName, jsx }) => {
  const code = `
import PropTypes from 'prop-types'
import * as React from 'react'
import {
  color,
  ColorProps,
  compose,
  space,
  SpaceProps,
  verticalAlign,
  VerticalAlignProps,
} from 'styled-system'
import styled from 'styled-components'
import { IconSizes, Omit } from './types'
import iconSizes from './iconSizes'

export interface Props extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'color' | 'opacity'>, SpaceProps, ColorProps, VerticalAlignProps {
  iconSize?: IconSizes
  color?: string
}

const Base = ({ iconSize, verticalAlign, opacity, ...props }: Props) => {
  return (
    JSX
  )
}

const COMPONENT_NAME = styled(Base)(
  compose(
    space,
    color,
    verticalAlign,
    iconSizes
  )
)

COMPONENT_NAME.propTypes = {
  // @ts-ignore
  iconSize: PropTypes.string,
}

COMPONENT_NAME.defaultProps = {
  verticalAlign: 'middle',
}

export default COMPONENT_NAME
  `
  const typeScriptTpl = template.smart(code, {
    plugins: ['typescript'],
    preserveComments: true,
    placeholderPattern: /^[_A-Z]{2,}$/,
  })

  return typeScriptTpl({ JSX: jsx, COMPONENT_NAME: componentName })
}

module.exports = {
  icon: true,
  ext: 'tsx',
  template: exportedTemplate,
  svgProps: {
    fill: 'currentcolor',
  },
  prettierConfig,
}
