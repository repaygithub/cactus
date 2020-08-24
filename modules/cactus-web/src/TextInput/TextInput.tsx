import { CactusTheme, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { border, textStyle } from '../helpers/theme'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement>, MarginProps {
  /** !important */
  disabled?: boolean
  status?: Status | null
}

interface InputProps {
  disabled?: boolean
  status?: Status | null
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${(p): string => p.theme.colors.success};
    background: ${(p): string => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${(p): string => p.theme.colors.warning};
    background: ${(p): string => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${(p): string => p.theme.colors.error};
    background: ${(p): string => p.theme.colors.transparentError};
  `,
}

const displayStatus = (props: TextInputProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  } else {
    return ''
  }
}

const TextInputBase = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props: TextInputProps, forwardRef): React.ReactElement => {
    const { className, ...rest } = omitMargins(props)

    return (
      <div className={className}>
        <Input ref={forwardRef} {...rest} />
      </div>
    )
  }
)

const shapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px;',
  round: 'border-radius: 20px;',
}

const Input = styled.input<InputProps>`
  box-sizing: border-box;
  border: ${(p) => border(p.theme, p.disabled ? 'lightGray' : 'darkContrast')};
  ${(p) => shapeMap[p.theme.shape]};
  height: 32px;
  outline: none;
  box-sizing: border-box;
  padding: 7px 28px 7px 15px;
  ${(p) => textStyle(p.theme, 'body')};
  width: ${(p): string | number => p.width || 'auto'};
  background-color: ${(p): string => p.theme.colors.white};

  &:disabled {
    cursor: not-allowed;
    border-color: ${(p): string => p.theme.colors.lightGray};
    background-color: ${(p): string => p.theme.colors.lightGray};
  }

  &:disabled::placeholder {
    color: ${(p): string => p.theme.colors.mediumGray};
  }
  &:focus {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${(p): string => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

export const TextInput = styled(TextInputBase)`
  box-sizing: border-box;
  ${margin}
`

TextInput.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
}

TextInput.defaultProps = {
  disabled: false,
  status: null,
}

export default TextInput
