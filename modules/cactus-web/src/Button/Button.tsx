import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { space, SpaceProps } from 'styled-system'
import { CactusTheme } from '@repay/cactus-theme'

export type ButtonVariants = 'standard' | 'action'

interface ButtonProps extends SpaceProps {
  variant?: ButtonVariants
  disabled?: boolean
}

type VariantMap = { [K in ButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> } & {
  disabled: FlattenInterpolation<ThemeProps<CactusTheme>>
}

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
  disabled: css`
    color: ${p => p.theme.colors.mediumGray};
    background-color: ${p => p.theme.colors.lightGray};
    border-color: ${p => p.theme.colors.lightGray};
    cursor: not-allowed;
  `,
}

const variantOrDiabled = (
  props: ButtonProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  if (props.disabled) {
    return variantMap.disabled
  } else if (props.variant !== undefined) {
    return variantMap[props.variant]
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
  ${space}
  ${variantOrDiabled}
`

Button.defaultProps = {
  variant: 'standard',
  disabled: false,
  type: 'button',
}

export default Button
