import React from 'react'

import { BorderSize, Shape } from '@repay/cactus-theme'
import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import { textStyle } from '../helpers/theme'
import PropTypes from 'prop-types'
import Spinner from '../Spinner/Spinner'
import styled, { css } from 'styled-components'

export type ButtonVariants = 'standard' | 'action' | 'danger' | 'warning' | 'success'

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
  loading?: boolean
  loadingText?: string
}

type VariantMap = { [K in ButtonVariants]: ReturnType<typeof css> }

const variantMap: VariantMap = {
  action: css`
    ${(p) => p.theme.colorStyles.callToAction}
    border-color: ${(p) => p.theme.colors.callToAction};

    &:hover {
      ${(p) => p.theme.colorStyles.base}
      border-color: ${(p) => p.theme.colors.base};
    }
  `,
  standard: css`
    color: ${(p) => p.theme.colors.base};
    background-color: ${(p) => p.theme.colors.white};
    border-color: ${(p) => p.theme.colors.base};

    &:hover {
      ${(p) => p.theme.colorStyles.base}
      border-color: ${(p) => p.theme.colors.base};
    }
  `,
  danger: css`
    ${(p) => p.theme.colorStyles.error}
    border-color: ${(p) => p.theme.colors.error};

    &:hover {
      color: ${(p) => p.theme.colors.white};
      background-color: ${(p) => p.theme.colors.errorDark};
      border-color: ${(p) => p.theme.colors.errorDark};
    }
  `,
  warning: css`
    ${(p) => p.theme.colorStyles.warning}
    border-color: ${(p) => p.theme.colors.warning};

    &:hover {
      color: ${(p) => p.theme.colors.white};
      background-color: ${(p) => p.theme.colors.warningDark};
      border-color: ${(p) => p.theme.colors.warningDark};
    }
  `,
  success: css`
    ${(p) => p.theme.colorStyles.success}
    border-color: ${(p) => p.theme.colors.success};

    &:hover {
      color: ${(p) => p.theme.colors.white};
      background-color: ${(p) => p.theme.colors.successDark};
      border-color: ${(p) => p.theme.colors.successDark};
    }
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    color: ${(p) => p.theme.colors.callToActionText};
    background-color: ${(p) => p.theme.colors.callToAction};
    border-color: ${(p) => p.theme.colors.callToAction};

    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
      background-color: ${(p) => p.theme.colors.white};
      border-color: ${(p) => p.theme.colors.white};
    }
  `,
  standard: css`
    color: ${(p) => p.theme.colors.white};
    background-color: ${(p) => p.theme.colors.base};
    border-color: ${(p) => p.theme.colors.white};

    &:hover {
      color: ${(p) => p.theme.colors.base};
      background-color: ${(p) => p.theme.colors.white};
      border-color: ${(p) => p.theme.colors.white};
    }
  `,
  danger: css`
    color: ${(p) => p.theme.colors.error};
    background-color: ${(p) => p.theme.colors.white};
    border-color: ${(p) => p.theme.colors.error};

    &:hover {
      color: ${(p) => p.theme.colors.white};
      background-color: ${(p) => p.theme.colors.error};
    }
  `,
  warning: css`
    color: ${(p) => p.theme.colors.warning};
    background-color: ${(p) => p.theme.colors.white};
    border-color: ${(p) => p.theme.colors.warning};

    &:hover {
      color: ${(p) => p.theme.colors.white};
      background-color: ${(p) => p.theme.colors.warning};
      border-color: ${(p) => p.theme.colors.warning};
    }
  `,
  success: css`
    color: ${(p) => p.theme.colors.success};
    background-color: ${(p) => p.theme.colors.white};
    border-color: ${(p) => p.theme.colors.success};

    &:hover {
      color: ${(p) => p.theme.colors.white};
      background-color: ${(p) => p.theme.colors.success};
      border-color: ${(p) => p.theme.colors.success};
    }
  `,
}

const disabled = css`
  color: ${(p) => p.theme.colors.mediumGray};
  background-color: ${(p) => p.theme.colors.lightGray};
  border-color: ${(p) => p.theme.colors.lightGray};
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
const getShape = (shape: Shape) => shapeMap[shape]

const getBorder = (size: BorderSize) => borderMap[size]

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
}) => {
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
  ${(p) => textStyle(p.theme, 'body')};
  ${(p) => getBorder(p.theme.border)};
  ${(p) => getShape(p.theme.shape)};

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
      ${(p) => getBorder(p.theme.border)};
      ${(p) => getShape(p.theme.shape)};
      border-color: ${(p) => p.theme.colors.callToAction};
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
