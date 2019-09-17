import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'
import PropTypes from 'prop-types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export interface TextInputProps
  extends Omit<
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
      'ref'
    >,
    MarginProps {
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
    border-color: ${p => p.theme.colors.success};
    background: ${p => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${p => p.theme.colors.warning};
    background: ${p => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
    background: ${p => p.theme.colors.transparentError};
  `,
}

const displayStatus = (props: TextInputProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  }
}

const TextInputBase = (props: TextInputProps) => {
  const { className, ...rest } = omitMargins(props)

  return (
    <div className={className}>
      <Input {...rest} />
    </div>
  )
}

const Input = styled.input<InputProps>`
  border: 1px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  border-radius: 20px;
  height: 32px;
  outline: none;
  box-sizing: border-box;
  padding: 7px 28px 7px 15px;
  ${p => p.theme.textStyles.body};
  width: ${p => p.width || 'auto'};
  background-color: ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.white)};

  &:focus {
    border-color: ${p => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${p => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

export const TextInput = styled(TextInputBase)`
  box-sizing: border-box;
  ${margin}
`

// @ts-ignore
TextInput.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
}

TextInput.defaultProps = {
  disabled: false,
  status: null,
}

export default TextInput
