import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import PropTypes from 'prop-types'
import Spinner from '../Spinner/Spinner'
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
  loading?: boolean
  loadingText?: string
}

type VariantMap = { [K in ButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToActionText};
    background-color: ${p => p.theme.colors.callToAction};
    border-color: ${p => p.theme.colors.callToAction};

    &:hover {
      color: ${p => p.theme.colors.baseText};
      background-color: ${p => p.theme.colors.base};
      border-color: ${p => p.theme.colors.base};
    }
  `,
  standard: css`
    color: ${p => p.theme.colors.base};
    background-color: ${p => p.theme.colors.white};
    border-color: ${p => p.theme.colors.base};

    &:hover {
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

    &:hover {
      color: ${p => p.theme.colors.callToAction};
      background-color: ${p => p.theme.colors.white};
      border-color: ${p => p.theme.colors.white};
    }
  `,
  standard: css`
    color: ${p => p.theme.colors.white};
    background-color: ${p => p.theme.colors.base};
    border-color: ${p => p.theme.colors.white};

    &:hover {
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

export const Button = styled(ButtonBase)`
  position: relative;
  border-radius: 20px;
  padding: 2px 30px;
  border: 2px solid;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  ${p => p.theme.textStyles.body};

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
      border: 2px solid ${p => p.theme.colors.callToAction};
      border-radius: 20px;
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

// @ts-ignore
Button.propTypes = {
  variant: PropTypes.oneOf(['standard', 'action']),
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
