import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getOmittableProps } from '../helpers/omit'
import { border, radius, textStyle } from '../helpers/theme'

export type TextButtonVariants = 'standard' | 'action' | 'danger' | 'dark'

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, MarginProps {
  variant?: TextButtonVariants
  /** !important */
  disabled?: boolean
  // No inverse danger variant
  inverse?: boolean
}

type VariantMap = { [K in TextButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${(p): string => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.base};
  `,
  danger: css`
    color: ${(p): string => p.theme.colors.error};
  `,
  dark: css`
    color: ${(p): string => p.theme.colors.darkContrast};
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    font-weight: 600;
    color: ${(p): string => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.white};
  `,
  danger: css``,
  dark: css`
    color: ${(p): string => p.theme.colors.darkContrast};
  `,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${(p): string => p.theme.colors.mediumGray};
  cursor: not-allowed;
`

const variantOrDisabled = (props: TextButtonProps) => {
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

export const focusStyle = css`
  ::after {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    border: ${(p) => border(p.theme, 'callToAction')};
    border-radius: ${radius(20)};
  }
`

const styleProps = getOmittableProps(margin, 'variant', 'inverse')
export const TextButton = styled.button.withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<TextButtonProps>`
  ${(p) => textStyle(p.theme, 'body')};
  position: relative;
  border: none;
  padding: 4px;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    text-decoration: ${(p): string => (!p.disabled ? 'underline' : '')};
  }

  &:focus {
    ${focusStyle}
  }

  &::-moz-focus-inner {
    border: 0;
  }

  svg {
    display: inline-block;
    margin-top: -4px;
    margin-right: 4px;
  }

  ${variantOrDisabled}
  ${margin}
`

TextButton.propTypes = {
  variant: PropTypes.oneOf(['standard', 'action', 'danger', 'dark']),
  disabled: PropTypes.bool,
  inverse: PropTypes.bool,
}

TextButton.defaultProps = {
  variant: 'standard',
  type: 'button',
}

export default TextButton
