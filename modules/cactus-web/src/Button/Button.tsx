import { BorderSize, ColorStyle, Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { textStyle } from '../helpers/theme'
import Spinner from '../Spinner/Spinner'

export type ButtonVariants = 'standard' | 'action' | 'danger' | 'warning' | 'success'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, MarginProps {
  variant?: ButtonVariants
  /** !important */
  disabled?: boolean
  inverse?: boolean
  loading?: boolean
  loadingText?: string
}

type VariantMap = { [K in ButtonVariants]: ReturnType<typeof css> }

const variantMap: VariantMap = {
  action: css`
    ${(p): ColorStyle => p.theme.colorStyles.callToAction}
    border-color: ${(p): string => p.theme.colors.callToAction};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.base}
      border-color: ${(p): string => p.theme.colors.base};
    }
  `,
  standard: css`
    color: ${(p): string => p.theme.colors.base};
    background-color: ${(p): string => p.theme.colors.white};
    border-color: ${(p): string => p.theme.colors.base};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.base}
      border-color: ${(p): string => p.theme.colors.base};
    }
  `,
  danger: css`
    ${(p): ColorStyle => p.theme.colorStyles.error}
    border-color: ${(p): string => p.theme.colors.error};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.errorDark}
      border-color: ${(p): string => p.theme.colors.errorDark};
    }
  `,
  warning: css`
    ${(p): ColorStyle => p.theme.colorStyles.warning}
    border-color: ${(p): string => p.theme.colors.warning};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.warningDark}
      border-color: ${(p): string => p.theme.colors.warningDark};
    }
  `,
  success: css`
    ${(p): ColorStyle => p.theme.colorStyles.success}
    border-color: ${(p): string => p.theme.colors.success};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.successDark}
      border-color: ${(p): string => p.theme.colors.successDark};
    }
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    border-color: ${(p): string => p.theme.colors.callToAction};

    &:hover {
      color: ${(p): string => p.theme.colors.callToAction};
      background-color: ${(p): string => p.theme.colors.white};
      border-color: ${(p): string => p.theme.colors.white};
    }
  `,
  standard: css`
    ${(p): ColorStyle => p.theme.colorStyles.base};
    border-color: ${(p): string => p.theme.colors.white};

    &:hover {
      color: ${(p): string => p.theme.colors.base};
      background-color: ${(p): string => p.theme.colors.white};
      border-color: ${(p): string => p.theme.colors.white};
    }
  `,
  danger: css`
    color: ${(p): string => p.theme.colors.error};
    background-color: ${(p): string => p.theme.colors.white};
    border-color: ${(p): string => p.theme.colors.error};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.error}
    }
  `,
  warning: css`
    color: ${(p): string => p.theme.colors.warning};
    background-color: ${(p): string => p.theme.colors.white};
    border-color: ${(p): string => p.theme.colors.warning};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.warning}
      border-color: ${(p): string => p.theme.colors.warning};
    }
  `,
  success: css`
    color: ${(p): string => p.theme.colors.success};
    background-color: ${(p): string => p.theme.colors.white};
    border-color: ${(p): string => p.theme.colors.success};

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.success}
      border-color: ${(p): string => p.theme.colors.success};
    }
  `,
}

const disabled = css`
  ${(p): ColorStyle => p.theme.colorStyles.disable};
  border-color: ${(p): string => p.theme.colors.lightGray};
  cursor: not-allowed;
`

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

const variantOrDisabled = (props: ButtonProps) => {
  const map = props.inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (props.variant !== undefined) {
    return map[props.variant]
  }
}

const ButtonBase: React.FC<ButtonProps> = ({
  loading,
  children,
  inverse,
  disabled,
  variant,
  loadingText,
  ...rest
}): React.ReactElement => {
  const props = omitMargins(rest)
  let spanProps = null
  if (loading === true) {
    spanProps = { style: { visibility: 'hidden' } as React.CSSProperties, 'aria-hidden': true }
  }
  return (
    <button {...props} disabled={loading || disabled} aria-live="assertive">
      <span {...spanProps}>{children}</span>
      {loading && <Spinner iconSize="small" aria-label={loadingText} />}
    </button>
  )
}

export const Button = styled(ButtonBase)<ButtonProps>`
  position: relative;
  padding: 2px 30px;
  outline: none;
  cursor: pointer;
  overflow: visible;
  box-sizing: border-box;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  ${(p): FlattenSimpleInterpolation => getBorder(p.theme.border)};
  ${(p): FlattenSimpleInterpolation => getShape(p.theme.shape)};

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus {
    ::after {
      content: '';
      display: block;
      position: absolute;
      height: calc(100% + 10px);
      width: calc(100% + 10px);
      top: -5px;
      left: -5px;
      ${(p): FlattenSimpleInterpolation => getBorder(p.theme.border)};
      ${(p): FlattenSimpleInterpolation => getShape(p.theme.shape)};
      border-color: ${(p): string => p.theme.colors.callToAction};
      box-sizing: border-box;
    }
  }

  svg {
    display: inline-block;
    margin-top: -4px;
  }

  ${Spinner} {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -8px;
    margin-top: -8px;
  }

  ${margin}
  ${variantOrDisabled}
`

Button.propTypes = {
  variant: PropTypes.oneOf(['standard', 'action', 'danger', 'warning', 'success']),
  disabled: PropTypes.bool,
  inverse: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
}

Button.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
  type: 'button',
  loadingText: 'loading',
}

export default Button
