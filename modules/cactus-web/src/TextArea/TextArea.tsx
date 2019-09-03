import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import { Omit } from '../types'
import { StatusPropType } from '../StatusMessage/StatusMessage'
import PropTypes from 'prop-types'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type Status = 'success' | 'warning' | 'error'

export interface TextAreaProps
  extends Omit<
      React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >,
      'ref'
    >,
    MarginProps {
  disabled?: boolean
  status?: Status | null
  width?: string
  height?: string
  resize?: boolean
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

const displayStatus = (props: TextAreaProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  }
}

const Area = styled.textarea<TextAreaProps>`
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  border-radius: 8px;
  min-height: 100px;
  min-width: 336px;
  box-sizing: border-box;
  ${p => p.theme.textStyles.body}
  padding: 8px 16px;
  outline: none;
  background-color: ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.white)};
  height: ${p => p.height || 'auto'};
  width: ${p => p.width || 'auto'};
  display: block;
  resize: ${p => (p.resize ? 'vertical' : 'none')};
  &:first-line {
    padding-right: 15px;
  }

  &:focus {
    border-color: ${p => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${p => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

const TextAreaBase = (props: TextAreaProps) => {
  const { className, ...rest } = splitProps(props)

  return (
    <div className={className}>
      <Area {...rest} />
    </div>
  )
}

export const TextArea = styled(TextAreaBase)`
  position: relative;
  display: block;

  ${margins}
`

// @ts-ignore
TextArea.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
  width: PropTypes.string,
  height: PropTypes.string,
  resize: PropTypes.bool,
}

TextArea.defaultProps = {
  disabled: false,
  status: null,
  resize: false,
}

export default TextArea
