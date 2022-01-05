import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { FlattenInterpolation, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { Status, StatusPropType, textFieldStatusMap } from '../helpers/status'
import { border, radius, textStyle } from '../helpers/theme'

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    MarginProps {
  disabled?: boolean
  status?: Status | null
  width?: string
  height?: string
  resize?: boolean
}

const displayStatus = (
  props: TextAreaProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | string => {
  if (props.status && !props.disabled) {
    return textFieldStatusMap[props.status]
  } else {
    return ''
  }
}

const Area = styled.textarea<TextAreaProps>`
  border: ${(p) => border(p.theme, p.disabled ? 'lightGray' : 'darkContrast')};
  border-radius: ${radius(8)};
  min-height: 100px;
  ${(p): string => p.theme.mediaQueries.small} {
    min-width: 336px;
  }
  box-sizing: border-box;
  ${(p) => textStyle(p.theme, 'body')}
  padding: 8px 16px;
  outline: none;
  background-color: ${(p): string => p.theme.colors.white};
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

  &:disabled {
    cursor: not-allowed;
    ${(p) => p.theme.colorStyles.disable};
  }

  &:disabled::placeholder {
    color: ${(p): string => p.theme.colors.mediumGray};
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
