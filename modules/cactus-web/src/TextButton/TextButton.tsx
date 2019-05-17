import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import { Omit } from '../types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type TextButtonVariants = 'standard' | 'action' | 'danger'

interface TextButtonProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref'
    >,
    MarginProps {
  variant?: TextButtonVariants
  /** !important */
  disabled?: boolean
  // No inverse danger variant
  inverse?: boolean
}

type VariantMap = { [K in TextButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${p => p.theme.colors.base};
  `,
  danger: css`
    color: ${p => p.theme.colors.error};
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    font-weight: 700;
    color: ${p => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${p => p.theme.colors.white};
  `,
  danger: css``,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${p => p.theme.colors.mediumGray};
  cursor: not-allowed;
`

const variantOrDisabled = (
  props: TextButtonProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { variant, inverse } = props
  if (variant === 'danger' && inverse) {
    throw new Error('A danger variant does not exist for an inverse TextButton.')
  }
  const map = inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (variant !== undefined) {
    return map[variant]
  }
}

export const TextButton = styled.button<TextButtonProps>`
  font-size: ${p => p.theme.textStyles.medium.fontSize};
  line-height: ${p => p.theme.textStyles.medium.lineHeight};
  border: none;
  padding: 4px 0 4px 0;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  cursor: pointer;

  :hover {
    text-decoration: ${p => !p.disabled && 'underline'};
  }

  :focus {
    text-decoration: ${p => !p.disabled && 'underline'};
  }

  &::-moz-focus-inner {
    border: 0;
  }

  svg {
    display: inline-block;
    margin-top: -4px;
  }

  ${variantOrDisabled}
  ${margins}
`

TextButton.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
  type: 'button',
}

export default TextButton
