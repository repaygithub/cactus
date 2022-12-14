import { NavigationClose } from '@repay/cactus-icons'
import { color, colorStyle, lineHeight, radius, space, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { margin, MarginProps } from 'styled-system'

import { withStyles } from '../helpers/styled'
import { IconButton } from '../IconButton/IconButton'

const closeTypes = ['no-button', 'button'] as const
interface TagProps extends MarginProps, React.HTMLAttributes<HTMLSpanElement> {
  closeOption?: boolean | typeof closeTypes[number]
  children: React.ReactNode
  onCloseIconClick?: React.MouseEventHandler<HTMLElement>
}

const TagBase = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ closeOption, children, onCloseIconClick, ...props }, ref): React.ReactElement => {
    return (
      <span ref={ref} {...props}>
        <span className="value-tag__label">{children}</span>
        {(!!closeOption || typeof onCloseIconClick === 'function') && (
          <IconButton
            as={closeOption === 'no-button' ? 'span' : undefined}
            iconSize="tiny"
            marginLeft="12px"
            aria-label="close"
            aria-controls={props.id}
            onClick={onCloseIconClick}
          >
            <NavigationClose />
          </IconButton>
        )}
      </span>
    )
  }
)

export const Tag = withStyles('span', {
  as: TagBase,
  displayName: 'Tag',
  styles: [margin],
})<MarginProps>`
  ${colorStyle('standard')};
  box-sizing: border-box;
  ${textStyle('small')};
  padding: 0 ${space(3)};
  border: 1px solid ${color('lightContrast')};
  border-radius: ${radius(8)};
  margin-right: ${space(1)};
  display: inline-block;
  ${(p) => p.hidden && 'visibility: hidden;'}
  ${lineHeight('small', 'height')};
  ${IconButton} {
    padding: 4px;
  }
`

Tag.propTypes = {
  id: PropTypes.string,
  closeOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(closeTypes)]),
  children: PropTypes.node.isRequired,
  hidden: PropTypes.bool,
  onCloseIconClick: PropTypes.func,
}

Tag.defaultProps = {
  closeOption: false,
  hidden: false,
}

export default Tag
