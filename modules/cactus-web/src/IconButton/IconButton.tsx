import { iconSizes } from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'
import { margin, MarginProps, system } from 'styled-system'

import { isIE } from '../helpers/constants'
import { getOmittableProps } from '../helpers/omit'
import { borderSize } from '../helpers/theme'

export type IconButtonVariants = 'standard' | 'action' | 'danger' | 'warning' | 'success' | 'dark'
export type IconButtonSizes = 'tiny' | 'small' | 'medium' | 'large'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

interface IconStyleProps extends MarginProps {
  iconSize?: IconButtonSizes
  variant?: IconButtonVariants
  disabled?: boolean
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
  warning: css`
    color: ${(p): string => p.theme.colors.warningDark};

    &:hover {
      color: ${(p): string => p.theme.colors.warning};
    }
  `,
  success: css`
    color: ${(p): string => p.theme.colors.success};

    &:hover {
      color: ${(p): string => p.theme.colors.successDark};
    }
  `,
  dark: css`
    color: ${(p): string => p.theme.colors.darkContrast};

    &:hover {
      color: ${(p): string => p.theme.colors.callToAction};
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
  warning: css`
    color: ${(p): string => p.theme.colors.warningDark};

    &:hover {
      color: ${(p): string => p.theme.colors.warning};
    }
  `,
  success: css`
    color: ${(p): string => p.theme.colors.success};

    &:hover {
      color: ${(p): string => p.theme.colors.successDark};
    }
  `,
  dark: css`
    color: ${(p): string => p.theme.colors.darkContrast};

    &:hover {
      color: ${(p): string => p.theme.colors.callToAction};
    }
  `,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${(p): string => p.theme.colors.mediumGray};
  cursor: not-allowed;
`

const shapeMap = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px;',
  round: 'border-radius: 50%;',
}

const focusOutlineSpacing = {
  tiny: 4,
  small: 8,
  medium: 8,
  large: 12,
}

const variantOrDisabled = (
  props: IconStyleProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const map = props.inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (props.variant !== undefined) {
    return map[props.variant]
  }
}

const IconButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref): React.ReactElement => {
    const { label, children, ...buttonProps } = props
    return (
      <button aria-label={label} ref={ref} {...buttonProps}>
        {children}
      </button>
    )
  }
)

const focusOutline = system({
  iconSize: (value: IconButtonSizes) => {
    const offset = focusOutlineSpacing[value] || focusOutlineSpacing.medium
    const styles: Record<string, string> = {
      height: `calc(100% + ${offset}px)`,
      width: `calc(100% + ${offset}px)`,
    }
    if (isIE) {
      const ieOffset = offset / 2
      styles.top = `-${ieOffset + 1}px`
      styles.left = `-${ieOffset}px`
    }
    return styles
  },
})

const styleProps = getOmittableProps(margin, 'display', 'inverse', 'variant', 'iconSize')
export const IconButton = styled(IconButtonBase).withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<IconStyleProps>`
  display: ${(p): string => p.display || 'inline-flex'};
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 1px;
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
      ${focusOutline}
      ${(p) => `border: ${borderSize(p)} solid;`}
      ${(p) => shapeMap[p.theme.shape]}
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
  variant: PropTypes.oneOf(['standard', 'action', 'danger', 'warning', 'success', 'dark']),
  disabled: PropTypes.bool,
  label: (props: ButtonProps, propName: string, componentName: string): Error | null => {
    if (!props.label && !props['aria-label'] && !props['aria-labelledby']) {
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
  'aria-labelledby': PropTypes.string,
  display: PropTypes.oneOf(['flex', 'inline-flex']),
  inverse: PropTypes.bool,
}

IconButton.defaultProps = {
  variant: 'standard',
  iconSize: 'medium',
  display: 'inline-flex',
  type: 'button',
}

export default IconButton
