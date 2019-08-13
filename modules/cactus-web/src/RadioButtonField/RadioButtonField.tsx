import React from 'react'

import { FieldEventHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import RadioButton, { RadioButtonProps } from '../RadioButton/RadioButton'
import styled from 'styled-components'
import useId from '../helpers/useId'

export interface RadioButtonFieldProps
  extends Omit<RadioButtonProps, 'id' | 'onChange' | 'onFocus' | 'onBlur'>,
    MarginProps {
  label: string
  name: string
  labelProps?: object
  id?: string
  onChange?: FieldEventHandler<string>
  onFocus?: FieldEventHandler<string>
  onBlur?: FieldEventHandler<string>
}

const RadioButtonFieldBase = (props: RadioButtonFieldProps) => {
  const {
    label,
    labelProps,
    id,
    className,
    name,
    onChange,
    onFocus,
    onBlur,
    ...radioButtonProps
  } = splitProps(props)
  const radioButtonId = useId(id, name)

  const handleEvent = (handler?: FieldEventHandler<string>) => {
    return (event: React.FormEvent<HTMLInputElement>) => {
      if (typeof handler === 'function') {
        const target = (event.target as unknown) as HTMLInputElement
        handler(name, target.value)
      }
    }
  }

  return (
    <FieldWrapper className={className}>
      <RadioButton
        id={radioButtonId}
        name={name}
        onChange={handleEvent(onChange)}
        onFocus={handleEvent(onFocus)}
        onBlur={handleEvent(onBlur)}
        {...radioButtonProps}
      />
      <Label htmlFor={radioButtonId} {...labelProps}>
        {label}
      </Label>
    </FieldWrapper>
  )
}

export const RadioButtonField = styled(RadioButtonFieldBase)`
  & + & {
    margin-top: 8px;
  }

  ${Label} {
    cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
  }

  ${margins}
`

// @ts-ignore
RadioButtonField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

RadioButtonField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default RadioButtonField
