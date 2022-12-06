import defaultTheme, {
  border,
  color,
  colorStyle,
  radius,
  textStyle,
  TextStyleCollection,
} from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'
import { compose, margin, MarginProps, width, WidthProps } from 'styled-system'

import { getStatusStyles, StatusProps, StatusPropType } from '../helpers/status'
import { flexItem, FlexItemProps } from '../helpers/styled'

type TextStyleKey = keyof TextStyleCollection
export const textStyles = Object.keys(defaultTheme.textStyles) as TextStyleKey[]

type InputElementProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'width'>
export interface TextInputProps
  extends InputElementProps,
    StatusProps,
    MarginProps,
    WidthProps,
    FlexItemProps {
  textStyle?: TextStyleKey
}

export const commonInputStyles = css<StatusProps>`
  box-sizing: border-box;
  border: ${border('darkContrast')};
  outline: none;
  ${colorStyle('standard')}

  &:disabled {
    cursor: not-allowed;
    border-color: ${color('lightGray')};
    ${colorStyle('disable')}
  }

  &:disabled::placeholder {
    color: ${color('mediumGray')};
  }

  &:focus {
    border-color: ${color('callToAction')};
  }

  &::placeholder {
    color: ${color('mediumContrast')};
    font-style: italic;
  }

  ${getStatusStyles}
`

const TextInput = styled.input<TextInputProps>`
  border-radius: ${radius(20)};
  padding: 3px 15px;
  ${(p) => textStyle(p, p.textStyle || 'body')};

  ${compose(margin, width, flexItem)}
  ${commonInputStyles}
`

TextInput.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
  textStyle: PropTypes.oneOf(textStyles),
}

export default TextInput
