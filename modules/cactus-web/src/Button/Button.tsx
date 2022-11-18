import { border, color, colorStyle, radius, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { flexItem, FlexItemProps, withStyles } from '../helpers/styled'
import Spinner from '../Spinner/Spinner'

export type ButtonVariants = 'standard' | 'action' | 'danger' | 'warning' | 'success'

interface ButtonProps extends FlexItemProps, MarginProps {
  variant?: ButtonVariants
  disabled?: boolean
  inverse?: boolean
  loading?: boolean
  loadingText?: string
}

type VariantMap = { [K in ButtonVariants]: ReturnType<typeof css> }

const variantMap: VariantMap = {
  action: css`
    ${colorStyle('callToAction')}
    border-color: ${color('callToAction')};

    &:hover {
      ${colorStyle('base')}
      border-color: ${color('base')};
    }
  `,
  standard: css`
    ${colorStyle('base', 'white')};
    border-color: ${color('base')};

    &:hover {
      ${colorStyle('base')}
    }
  `,
  danger: css`
    ${colorStyle('error')}
    border-color: ${color('error')};

    &:hover {
      ${colorStyle('errorDark')}
      border-color: ${color('errorDark')};
    }
  `,
  warning: css`
    ${colorStyle('warning')}
    border-color: ${color('warning')};

    &:hover {
      ${colorStyle('warningDark')}
      border-color: ${color('warningDark')};
    }
  `,
  success: css`
    ${colorStyle('success')}
    border-color: ${color('success')};

    &:hover {
      ${colorStyle('successDark')}
      border-color: ${color('successDark')};
    }
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    ${colorStyle('callToAction')};
    border-color: ${color('callToAction')};

    &:hover {
      ${colorStyle('callToAction', 'white')};
      border-color: ${color('white')};
    }
  `,
  standard: css`
    ${colorStyle('base')};
    border-color: ${color('white')};

    &:hover {
      ${colorStyle('base', 'white')};
    }
  `,
  danger: css`
    ${colorStyle('error', 'white')};
    border-color: ${color('error')};

    &:hover {
      ${colorStyle('error')}
    }
  `,
  warning: css`
    ${colorStyle('warning', 'white')};
    border-color: ${color('warning')};

    &:hover {
      ${colorStyle('warning')}
    }
  `,
  success: css`
    ${colorStyle('success', 'white')};
    border-color: ${color('success')};

    &:hover {
      ${colorStyle('success')}
    }
  `,
}

const disabledCss = css`
  ${colorStyle('disable')};
  border-color: ${color('lightGray')};
  cursor: not-allowed;
`

const variantOrDisabled = (props: ButtonProps) => {
  const map = props.inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabledCss
  } else if (props.variant !== undefined) {
    return map[props.variant]
  }
}

const SHOW_SPINNER = { visibility: 'visible' } as React.CSSProperties

const buttonLoadingState = (props: ButtonProps) => {
  if (props.loading) {
    const { children, style } = props as React.HTMLAttributes<any>
    return {
      disabled: true,
      'aria-label': props.loadingText,
      style: { ...style, color: 'transparent' },
      children: (
        <>
          {children}
          <Spinner style={SHOW_SPINNER} iconSize="small" color="mediumGray" />
        </>
      ),
    }
  }
}

export const Button = withStyles('button', {
  displayName: 'Button',
  styles: [flexItem, margin],
  transitiveProps: ['inverse', 'variant', 'loading', 'loadingText'],
  extraAttrs: buttonLoadingState,
})<ButtonProps>`
  position: relative;
  padding: 2px 30px;
  outline: none;
  cursor: pointer;
  overflow: visible;
  box-sizing: border-box;
  text-decoration: none;
  display: inline-block;
  ${textStyle('body')};
  border: ${border('transparent') /* color set with variant */};
  border-radius: ${radius(20)};

  ${(p) => p.loading && `> * { visibility: hidden; }`}

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
      border: ${border('callToAction')};
      border-radius: ${radius(20)};
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
  type: 'button',
  loadingText: 'loading',
  'aria-live': 'assertive',
}

export default Button
