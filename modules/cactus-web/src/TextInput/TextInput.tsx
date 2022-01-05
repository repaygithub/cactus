import defaultTheme, { ColorStyle, TextStyleCollection } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { Status, StatusPropType, textFieldStatusMap } from '../helpers/status'
import { border, radius, textStyle } from '../helpers/theme'

type TextStyleKey = keyof TextStyleCollection
export const textStyles = Object.keys(defaultTheme.textStyles) as TextStyleKey[]

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement>, MarginProps {
  /** !important */
  disabled?: boolean
  status?: Status | null
  textStyle?: TextStyleKey
}

interface InputProps {
  disabled?: boolean
  status?: Status | null
  textStyle?: TextStyleKey
}

const displayStatus = (props: TextInputProps) => {
  if (props.status && !props.disabled) {
    return textFieldStatusMap[props.status]
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

const Input = styled.input<InputProps>`
  box-sizing: border-box;
  border: ${(p) => border(p.theme, p.disabled ? 'lightGray' : 'darkContrast')};
  border-radius: ${radius(20)};
  outline: none;
  padding: 3px 28px 3px 15px;
  ${(p) => textStyle(p.theme, p.textStyle || 'body')};
  width: ${(p): string | number => p.width || 'auto'};
  background-color: ${(p): string => p.theme.colors.white};

  &:disabled {
    cursor: not-allowed;
    border-color: ${(p): string => p.theme.colors.lightGray};
    ${(p): ColorStyle => p.theme.colorStyles.disable};
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
  textStyle: PropTypes.oneOf(textStyles),
}

TextInput.defaultProps = {
  disabled: false,
  status: null,
}

export default TextInput
