import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import { Omit } from '../types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type ButtonVariants = 'standard' | 'action'

interface ButtonProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref' | 'disabled'
    >,
    MarginProps {
  variant?: ButtonVariants
  /** !important */
  disabled?: boolean
  inverse?: boolean
}

type VariantMap = { [K in ButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToActionText};
    background-color: ${p => p.theme.colors.callToAction};
    border-color: ${p => p.theme.colors.callToAction};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.baseText};
      background-color: ${p => p.theme.colors.base};
      border-color: ${p => p.theme.colors.base};
    }
  `,
  standard: css`
    color: ${p => p.theme.colors.base};
    background-color: ${p => p.theme.colors.white};
    border-color: ${p => p.theme.colors.base};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.baseText};
      background-color: ${p => p.theme.colors.base};
      border-color: ${p => p.theme.colors.base};
    }
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToActionText};
    background-color: ${p => p.theme.colors.callToAction};
    border-color: ${p => p.theme.colors.callToAction};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.callToAction};
      background-color: ${p => p.theme.colors.white};
      border-color: ${p => p.theme.colors.white};
    }
  `,
  standard: css`
    color: ${p => p.theme.colors.white};
    background-color: ${p => p.theme.colors.base};
    border-color: ${p => p.theme.colors.white};

    &:hover,
    &:focus {
      color: ${p => p.theme.colors.base};
      background-color: ${p => p.theme.colors.white};
      border-color: ${p => p.theme.colors.white};
    }
  `,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${p => p.theme.colors.mediumGray};
  background-color: ${p => p.theme.colors.lightGray};
  border-color: ${p => p.theme.colors.lightGray};
  cursor: not-allowed;
`

const variantOrDisabled = (
  props: ButtonProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const map = props.inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (props.variant !== undefined) {
    return map[props.variant]
  }
}

export const Button = styled.button<ButtonProps>`
  border-radius: 20px;
  padding: 2px 30px;
  border: 2px solid;
  outline: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1.5em;

  svg {
    display: inline-block;
    margin-top: -4px;
  }

  ${margins}
  ${variantOrDisabled}
`

Button.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
  type: 'button',
}

export default Button
