import React from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { MarginProps, margins } from '../helpers/margins'
import Label from '../Label/Label'
import RadioButton, { RadioButtonProps } from '../RadioButton/RadioButton'
import styled from 'styled-components'
import useId from '../helpers/useId'

interface RadioButtonFieldProps extends Omit<RadioButtonProps, 'id' | 'onChange'>, MarginProps {
  label: string
  name: string
  labelProps?: object
  id?: string
  onChange?: FieldOnChangeHandler<boolean>
}

const RadioButtonFieldBase = (props: RadioButtonFieldProps) => {
  const { label, labelProps, id, className, name, onChange, ...radioButtonProps } = props
  const radioButtonId = useId(id, name)
  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        const target = (event.target as unknown) as HTMLInputElement
        onChange(name, target.checked)
      }
    },
    [name, onChange]
  )

  return (
    <div className={className}>
      <RadioButton id={radioButtonId} name={name} onChange={handleChange} {...radioButtonProps} />
      <Label htmlFor={radioButtonId} {...labelProps}>
        {label}
      </Label>
    </div>
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

  ${RadioButton} {
    top: -1px;
  }

  ${margins}
`

RadioButtonField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default RadioButtonField
