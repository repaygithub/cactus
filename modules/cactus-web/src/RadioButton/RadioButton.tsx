import React from 'react'

import { MarginProps, margins, splitProps } from '../helpers/margins'
import { Omit } from '../types'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export interface RadioButtonProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'as'>,
    MarginProps {
  id: string
  name: string
  disabled?: boolean
}

interface StyledRadioButtonProps extends React.HTMLProps<HTMLSpanElement> {
  disabled?: boolean
}

const RadioButtonBase = (props: RadioButtonProps) => {
  const componentProps = splitProps<RadioButtonProps>(props)
  const { disabled, id, className, ...radioButtonProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenRadioButton id={id} disabled={disabled} {...radioButtonProps} />
      <StyledRadioButton aria-hidden={true} disabled={disabled} />
    </label>
  )
}

const HiddenRadioButton = styled.input.attrs({ type: 'radio' as string })`
  opacity: 0;
  height: 0;
  width: 0;
  margin: 0;
  position: absolute;
`

const StyledRadioButton = styled.span<StyledRadioButtonProps>`
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${p => (p.disabled ? p.theme.colors.lightGray : 'transparent')};
  border: 2px solid ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.base)};

  :after {
    position: absolute;
    content: '';
    display: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${p => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.callToAction)};
    margin: 2px 2px;
    box-sizing: border-box;
  }
`

export const RadioButton = styled(RadioButtonBase)`
  position: relative;
  display: inline-block;
  vertical-align: -1px;
  line-height: 16px;
  width: 16px;
  height: 16px;
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};

  input:checked ~ span {
    border-color: ${p => !p.disabled && p.theme.colors.callToAction};
    background-color: transparent;
  }

  input:checked ~ span:after {
    display: block;
  }

  input:focus ~ span {
    box-shadow: 0 0 8px ${p => p.theme.colors.callToAction};
  }

  ${margins}
`

// @ts-ignore
RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

RadioButton.defaultProps = {
  disabled: false,
}

export default RadioButton
