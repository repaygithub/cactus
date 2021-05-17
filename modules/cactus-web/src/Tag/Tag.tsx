import { NavigationClose } from '@repay/cactus-icons'
import { TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { CSSObject, FlattenSimpleInterpolation } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { radius, textStyle } from '../helpers/theme'

interface TagProps extends MarginProps, React.HTMLAttributes<HTMLSpanElement> {
  closeOption?: boolean
  children: React.ReactNode
  onCloseIconClick?: () => void
}

const TagBase = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ closeOption, children, onCloseIconClick, ...props }, ref): React.ReactElement => {
    return (
      <span ref={ref} {...props}>
        <span className="value-tag__label">{children}</span>
        {(closeOption || typeof onCloseIconClick === 'function') && (
          <NavigationClose data-role="close" onClick={onCloseIconClick} />
        )}
      </span>
    )
  }
)

export const Tag = styled(TagBase)`
  ${(p) => p.theme.colorStyles.standard};
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
}

Tag.defaultProps = {
  id: 'tag-id',
  closeOption: false,
  hidden: false,
}

export default Tag
