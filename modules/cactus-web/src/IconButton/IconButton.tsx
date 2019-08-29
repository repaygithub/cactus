import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps } from 'styled-system'
import { omitMargins } from '../helpers/omit'
import { system } from 'styled-system'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type IconButtonVariants = 'standard' | 'action'
export type IconButtonSizes = 'tiny' | 'small' | 'medium' | 'large'

interface IconButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    MarginProps {
  iconSize?: IconButtonSizes
  variant?: IconButtonVariants
  disabled?: boolean
  label?: string
  display?: 'flex' | 'inline-flex'
  inverse?: boolean
}

const iconSizes = system({
  iconSize: {
    property: 'fontSize',
    scale: 'iconSizes',
    transform: (size, scale) => {
      let iconSize: string | number = get(scale, size, size)
      iconSize = iconSize.toString()
      if (/^[0-9]+$/.test(iconSize)) {
        iconSize += 'px'
      }
      return iconSize
    },
  },
})

type VariantMap = { [K in IconButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToAction};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.base};
    }
  `,
  standard: css`
    color: ${p => p.theme.colors.base};

    &:hover {
      color: ${p => p.theme.colors.callToAction};
    }
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToAction};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.white};
    }
  `,
  standard: css`
    color: ${p => p.theme.colors.white};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.base};
      background: ${p => p.theme.colors.white};
    }
  `,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${p => p.theme.colors.mediumGray};
  cursor: not-allowed;
`

const variantOrDisabled = (
  props: IconButtonProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const map = props.inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (props.variant !== undefined) {
    return map[props.variant]
  }
}

const IconButtonBase = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { label, children, inverse, iconSize, display, ...buttonProps } = props
  const withoutMargins = omitMargins(buttonProps)

  return (
    <button aria-label={label} ref={ref} {...withoutMargins}>
      {children}
    </button>
  )
})

export const IconButton = styled(IconButtonBase)<IconButtonProps>`
  display: ${p => p.display || 'inline-flex'};
  align-items: center;
  justify-content: center;
  padding: 1px;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus {
    background-color: ${p => p.theme.colors.transparentCTA};
  }

  ${variantOrDisabled}
  ${margin}
  ${iconSizes}
`

// @ts-ignore
IconButton.propTypes = {
  iconSize: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
  variant: PropTypes.oneOf(['standard', 'action']),
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  display: PropTypes.oneOf(['flex', 'inline-flex']),
  inverse: PropTypes.bool,
}

IconButton.defaultProps = {
  variant: 'standard',
  iconSize: 'medium',
  display: 'inline-flex',
  disabled: false,
  inverse: false,
  type: 'button',
}

export default IconButton
