import { iconSizes } from '@repay/cactus-icons'
import { CactusTheme, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, {
  css,
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemeProps,
} from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { isIE } from '../helpers/constants'
import { omitMargins } from '../helpers/omit'

export type IconButtonVariants = 'standard' | 'action' | 'danger'
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

type VariantMap = { [K in IconButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${(p): string => p.theme.colors.callToAction};

    &:hover {
      color: ${(p): string => p.theme.colors.base};
    }
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.base};

    &:hover {
      color: ${(p): string => p.theme.colors.callToAction};
    }
  `,
  danger: css`
    color: ${(p): string => p.theme.colors.error};

    &:hover {
      color: ${(p): string => p.theme.colors.errorDark};
    }
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    color: ${(p): string => p.theme.colors.callToAction};

    &:hover,
    &:focus {
      color: ${(p): string => p.theme.colors.white};
    }
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.white};

    &:hover,
    &:focus {
      color: ${(p): string => p.theme.colors.base};
      background: ${(p): string => p.theme.colors.white};
    }
  `,
  danger: css`
    color: ${(p): string => p.theme.colors.error};

    &:hover,
    &:focus {
      color: ${(p): string => p.theme.colors.white};
    }
  `,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${(p): string => p.theme.colors.mediumGray};
  cursor: not-allowed;
`

const shapeMap = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 8px;
  `,
  round: css`
    border-radius: 20px;
  `,
}

const getShape = (shape: Shape): FlattenSimpleInterpolation => shapeMap[shape]

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

const IconButtonBase = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref): React.ReactElement => {
    const { label, children, inverse, iconSize, display, ...buttonProps } = props
    const withoutMargins = omitMargins(buttonProps)

    return (
      <button aria-label={label} ref={ref} {...withoutMargins}>
        {children}
      </button>
    )
  }
)

export const IconButton = styled(IconButtonBase)<IconButtonProps>`
  display: ${(p): string => p.display || 'inline-flex'};
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  position: relative;
  overflow: visible;

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus {
    ::after {
      content: '';
      display: block;
      position: absolute;
      height: 40px;
      width: 40px;
      ${() => {
        if (isIE) {
          return `
            top: -8px;
            left: 0px;
          `
        }
      }}
      border: 1px solid;
      ${(p) => getShape(p.theme.shape)}
      border-color: ${(p): string => p.theme.colors.callToAction};
      box-sizing: border-box;
    }
  }

  ${variantOrDisabled}
  ${margin}
  ${iconSizes}
`

IconButton.propTypes = {
  iconSize: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
  variant: PropTypes.oneOf(['standard', 'action', 'danger']),
  disabled: PropTypes.bool,
  label: (props: IconButtonProps, propName: string, componentName: string): Error | null => {
    if (!props.label && !props['aria-labelledby']) {
      return new Error(
        `One of props 'label' or 'aria-labelledby' was not specified in ${componentName}.`
      )
    } else if (props.label !== undefined && typeof props.label !== 'string') {
      return new Error(
        `Invalid prop 'label' of type '${typeof props.label}' supplied to '${componentName}', expected 'string'.`
      )
    }
    return null
  },
  'aria-labelledby': (
    props: IconButtonProps,
    propName: string,
    componentName: string
  ): Error | null => {
    if (!props['aria-labelledby'] && !props.label) {
      return new Error(
        `One of props 'label' or 'aria-labelledby' was not specified in ${componentName}.`
      )
    } else if (props['aria-labelledby'] && typeof props['aria-labelledby'] !== 'string') {
      return new Error(
        `Invalid prop 'aria-labelledby' of type '${typeof props[
          'aria-labelledby'
        ]}' supplied to '${componentName}', expected 'string'.`
      )
    }
    return null
  },
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
