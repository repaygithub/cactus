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

import { omitMargins } from '../helpers/omit'
import { getStatusStyles, StatusProps, StatusPropType } from '../helpers/status'

type TextStyleKey = keyof TextStyleCollection
export const textStyles = Object.keys(defaultTheme.textStyles) as TextStyleKey[]

type InputElementProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'width'>
export interface TextInputProps extends InputElementProps, StatusProps, MarginProps, WidthProps {
  textStyle?: TextStyleKey
}

interface InputProps extends StatusProps {
  $width: string
  textStyle?: TextStyleKey
}

const TextInputBase = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props: TextInputProps, forwardRef): React.ReactElement => {
    const { className, width: widthProp, ...rest } = omitMargins(props)

    return (
      <div className={className}>
        <Input ref={forwardRef} {...rest} $width={widthProp ? '100%' : 'auto'} />
      </div>
    )
  }
)

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

const Input = styled.input<InputProps>`
  border-radius: ${radius(20)};
  padding: 3px 28px 3px 15px;
  ${(p) => textStyle(p, p.textStyle || 'body')};
  width: ${(p) => p.$width};

  ${commonInputStyles}
`

export const TextInput = styled(TextInputBase)`
  box-sizing: border-box;
  &&& {
    ${compose(margin, width)}
  }
`

TextInput.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
  textStyle: PropTypes.oneOf(textStyles),
}

export default TextInput
