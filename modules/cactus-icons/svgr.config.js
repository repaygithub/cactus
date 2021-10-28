const prettierConfig = JSON.parse(
  require('fs').readFileSync(require('path').join(__dirname, '../..', '.prettierrc'))
)
prettierConfig.parser = 'typescript'

const exportedTemplate = ({ template }, opts, { componentName, jsx }) => {
  const code = `
import PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'styled-components'
import { color, compose, space, verticalAlign } from 'styled-system'
import iconSizes from './iconSizes'
import { IconProps } from './types'

const Base = ({ iconSize, verticalAlign, opacity, color, ...props }: IconProps) => {
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
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
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
