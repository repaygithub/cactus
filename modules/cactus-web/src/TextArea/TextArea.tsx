import React from 'react'

import { BorderSize, CactusTheme, Shape } from '@repay/cactus-theme'
import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
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
    border-color: ${(p) => p.theme.colors.success};
    background: ${(p) => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${(p) => p.theme.colors.warning};
    background: ${(p) => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${(p) => p.theme.colors.error};
    background: ${(p) => p.theme.colors.transparentError};
  `,
}

const displayStatus = (props: TextAreaProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  }
}

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const shapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 4px;
  `,
  round: css`
    border-radius: 8px;
  `,
}

const getBorder = (borderSize: BorderSize) => borderMap[borderSize]
const getShape = (shape: Shape) => shapeMap[shape]

const Area = styled.textarea<TextAreaProps>`
  ${(p) => getBorder(p.theme.border)}
  border-color: ${(p) => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  ${(p) => getShape(p.theme.shape)}
  min-height: 100px;
  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small}{
    min-width: 336px;

  }
  box-sizing: border-box;
  ${(p) => p.theme.textStyles.body}
  padding: 8px 16px;
  outline: none;
  background-color: ${(p) => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.white)};
  height: ${(p) => p.height || 'auto'};
  width: ${(p) => p.width || 'auto'};
  display: block;
  resize: ${(p) => (p.resize ? 'vertical' : 'none')};
  &:first-line {
    padding-right: 15px;
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

const TextAreaBase = (props: TextAreaProps) => {
  const { className, ...rest } = omitMargins(props)

  return (
    <div className={className}>
      <Area {...rest} />
    </div>
  )
}

export const TextArea = styled(TextAreaBase)`
  position: relative;
  display: block;

  ${margin}
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
