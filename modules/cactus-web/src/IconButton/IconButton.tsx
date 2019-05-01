import React from 'react'
import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { space, SpaceProps } from 'styled-system'
import { CactusTheme } from '@repay/cactus-theme'
import { Omit } from '../types'
import splitProps from '../helpers/splitProps'

export type IconButtonVariants = 'standard' | 'action'
export type IconButtonSizes = 'tiny' | 'small' | 'medium' | 'large'

interface IconButtonProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref'
    >,
    SpaceProps {
  iconSize?: IconButtonSizes
  variant?: IconButtonVariants
  disabled?: boolean
  label?: string
  display?: 'flex' | 'inline-flex'
  inverse?: boolean
}

type SizeMap = { [K in IconButtonSizes]: string }

const sizeMap: SizeMap = {
  tiny: '8px',
  small: '16px',
  medium: '24px',
  large: '40px',
}

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

    &:hover,
    &:focus {
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
  const [componentProps, marginProps] = splitProps<IconButtonProps>(props, 'IconButton')
  const { label, children, inverse, iconSize, ...buttonProps } = componentProps

  return (
    <button aria-label={label} ref={ref} {...buttonProps} {...marginProps}>
      {children}
    </button>
  )
})

export const StyledIconButton = styled.button<IconButtonProps>`
  display: ${p => p.display || 'inline-flex'};
  font-size: ${p => p.iconSize !== undefined && sizeMap[p.iconSize]};
  align-items: center;
  justify-content: center;
  padding: 0px;
  border-radius: 50%;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  ${space}
  ${variantOrDisabled}
`

const IconButton = (props: IconButtonProps) => {
  const [componentProps, marginProps] = splitProps<IconButtonProps>(props, 'IconButton')
  const { label, children } = componentProps

  return (
    <StyledIconButton aria-label={label} {...componentProps} {...marginProps}>
      {children}
    </StyledIconButton>
  )
}

IconButton.defaultProps = {
  variant: 'standard',
  iconSize: 'medium',
  disabled: false,
  inverse: false,
}

export default IconButton
