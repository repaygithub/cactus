import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'

export type TextButtonVariants = 'standard' | 'action' | 'danger'

interface TextButtonProps {
  variant?: TextButtonVariants
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
  text-decoration: line-through;
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
  font-size: 18px;
  border: none;
  padding: 2px 0;
  line-height: 1.5em;
  outline: none;
  background-color: transparent;
  text-decoration: none;

  :hover {
    cursor: ${p => (p.disabled ? 'auto' : 'pointer')};
    text-decoration: ${p => !p.disabled && 'underline'};
  }

  :focus {
    text-decoration: ${p => !p.disabled && 'underline'};
  }

  svg {
    display: inline-block;
    margin-top: -4px;
  }

  ${variantOrDisabled}
`

TextButton.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
}

export default TextButton
