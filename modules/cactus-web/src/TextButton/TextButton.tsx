import { BorderSize, Shape } from '@repay/cactus-theme'
import { CactusTheme, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import styled, {
  css,
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemeProps,
} from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { textStyle } from '../helpers/theme'
import { Omit } from '../types'

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
    color: ${(p): string => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.base};
  `,
  danger: css`
    color: ${(p): string => p.theme.colors.error};
  `,
}

const borderMap = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

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

const getBorder = (size: BorderSize): FlattenSimpleInterpolation => borderMap[size]

const inverseVariantMap: VariantMap = {
  action: css`
    font-weight: 600;
    color: ${(p): string => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.white};
  `,
  danger: css``,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${(p): string => p.theme.colors.mediumGray};
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
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
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
    ::after {
      content: '';
      display: block;
      box-sizing: border-box;
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0px;
      left: 0px;
      ${(p): FlattenSimpleInterpolation => getBorder(p.theme.border)};
      ${(p): FlattenSimpleInterpolation => getShape(p.theme.shape)};
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
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

// @ts-ignore
TextButton.propTypes = {
  variant: PropTypes.oneOf(['standard', 'action', 'danger']),
  disabled: PropTypes.bool,
  inverse: PropTypes.bool,
}

TextButton.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
  type: 'button',
}

export default TextButton
