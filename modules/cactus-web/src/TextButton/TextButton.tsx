import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'

export type TextButtonVariants = 'standard' | 'action'

interface TextButtonProps {
  variant?: TextButtonVariants
  disabled?: boolean
  inverse?: boolean
}

type VariantMap = { [K in TextButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${p => p.theme.colors.darkContrast};
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${p => p.theme.colors.white};
  `,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${p => p.theme.colors.mediumGray};
`

const variantOrDisabled = (
  props: TextButtonProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const map = props.inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (props.variant !== undefined) {
    return map[props.variant]
  }
}

const TextButton = styled.button<TextButtonProps>`
  font-weight: 300;
  border: none;
  padding: 0px;
  background-color: transparent;
  :hover {
    cursor: ${p => (p.disabled ? 'auto' : 'pointer')};
    text-decoration: ${p => (p.disabled ? 'none' : 'underline')};
  }
  :focus {
    text-decoration: ${p => (p.disabled ? 'none' : 'underline')};
  }
  ${variantOrDisabled}
`

TextButton.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
}

export default TextButton
