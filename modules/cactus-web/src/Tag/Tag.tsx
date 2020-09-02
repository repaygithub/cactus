import { NavigationClose } from '@repay/cactus-icons'
import { Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, CSSObject, FlattenSimpleInterpolation } from 'styled-components'

import { textStyle } from '../helpers/theme'

interface TagProps {
  id?: string
  className?: string
  closeOption?: boolean
  children: React.ReactNode
  hidden?: boolean
  onCloseIconClick?: () => void
}

const TagBase = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ id, className, closeOption, children, onCloseIconClick }, ref): React.ReactElement => {
    return (
      <span id={id} ref={ref} className={className}>
        <span className="value-tag__label">{children}</span>
        {closeOption && <NavigationClose data-role="close" onClick={onCloseIconClick} />}
      </span>
    )
  }
)

const valueShapeMap: { [K in Shape]: FlattenSimpleInterpolation } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 4px;
  `,
  round: css`
    border-radius: 8px;
  `,
}
const getValueShape = (shape: Shape): FlattenSimpleInterpolation => valueShapeMap[shape]

export const Tag = styled(TagBase)`
  box-sizing: border-box;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
  padding: 0 8px 0 8px;
  border: 1px solid ${(p): string => p.theme.colors.lightContrast};
  ${(p): FlattenSimpleInterpolation => getValueShape(p.theme.shape as Shape)}
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
  closeOption: true,
  hidden: false,
}

export default Tag
