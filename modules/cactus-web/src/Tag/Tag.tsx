import { NavigationClose } from '@repay/cactus-icons'
import defaultTheme, { CactusTheme, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { CSSObject, FlattenSimpleInterpolation } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { radius, textStyle } from '../helpers/theme'

type ColorStyleKey = keyof CactusTheme['colorStyles']
const colorStyleKeys = Object.keys(defaultTheme.colorStyles) as ColorStyleKey[]

interface TagProps extends MarginProps {
  id?: string
  className?: string
  closeOption?: boolean
  children: React.ReactNode
  hidden?: boolean
  onCloseIconClick?: () => void
  colorStyle?: ColorStyleKey
}

const TagBase = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ id, className, closeOption, children, onCloseIconClick }, ref): React.ReactElement => {
    return (
      <span id={id} ref={ref} className={className}>
        <span className="value-tag__label">{children}</span>
        {(closeOption || typeof onCloseIconClick === 'function') && (
          <NavigationClose data-role="close" onClick={onCloseIconClick} />
        )}
      </span>
    )
  }
)

const validColor = (style: any): ColorStyleKey =>
  colorStyleKeys.includes(style) ? style : 'standard'

export const Tag = styled(TagBase)`
  ${(p) => p.theme.colorStyles[validColor(p.colorStyle)]};
  box-sizing: border-box;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
  padding: 0 8px 0 8px;
  border: 1px solid ${(p): string => p.theme.colors.lightContrast};
  border-radius: ${radius(8)};
  margin-right: 2px;
  display: inline-block;
  height: 24px;
  ${(p): CSSObject | undefined => (p.hidden ? { visibility: 'hidden' } : undefined)}

  ${NavigationClose} {
    appearance: none;
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 8px;
    padding: 4px;
    margin-left: 12px;
    vertical-align: -3px;
  }
  ${margin}
`

Tag.propTypes = {
  id: PropTypes.string,
  closeOption: PropTypes.bool,
  children: PropTypes.node.isRequired,
  hidden: PropTypes.bool,
  onCloseIconClick: PropTypes.func,
  colorStyle: PropTypes.oneOf(colorStyleKeys),
}

Tag.defaultProps = {
  id: 'tag-id',
  closeOption: false,
  hidden: false,
}

export default Tag
