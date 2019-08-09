import React from 'react'

import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
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
  onChange?: FieldOnChangeHandler<string>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
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

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        const target = (event.target as unknown) as HTMLInputElement
        onChange(name, target.value)
      }
    },
    [name, onChange]
  )

  const handleFocus = (event: React.FocusEvent) => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (event: React.FocusEvent) => {
    handleEvent(onBlur, name)
  }

  return (
    <FieldWrapper className={className}>
      <RadioButton
        id={radioButtonId}
        name={name}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
