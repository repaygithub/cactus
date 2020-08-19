import { BorderSize, CactusTheme, Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, {
  css,
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemeProps,
} from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { textStyle } from '../helpers/theme'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
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

const displayStatus = (
  props: TextAreaProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | string => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  } else {
    return ''
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

const getBorder = (borderSize: BorderSize): FlattenInterpolation<ThemeProps<CactusTheme>> =>
  borderMap[borderSize]
const getShape = (shape: Shape): FlattenInterpolation<ThemeProps<CactusTheme>> => shapeMap[shape]

const Area = styled.textarea<TextAreaProps>`
  ${(p): FlattenInterpolation<ThemeProps<CactusTheme>> => getBorder(p.theme.border)}
  border-color: ${(p): string =>
    p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast};
  ${(p): FlattenInterpolation<ThemeProps<CactusTheme>> => getShape(p.theme.shape)}
  min-height: 100px;
  ${(p): string => (p.theme.mediaQueries ? p.theme.mediaQueries.small : '')}{
    min-width: 336px;

  }
  box-sizing: border-box;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')}
  padding: 8px 16px;
  outline: none;
  background-color: ${(p): string =>
    p.disabled ? p.theme.colors.lightGray : p.theme.colors.white};
  height: ${(p): string => p.height || 'auto'};
  width: ${(p): string => p.width || 'auto'};
  display: block;
  resize: ${(p): string => (p.resize ? 'vertical' : 'none')};
  &:first-line {
    padding-right: 15px;
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

const TextAreaBase = (props: TextAreaProps): React.ReactElement => {
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
