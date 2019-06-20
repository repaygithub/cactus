import React from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import RadioButton, { RadioButtonProps } from '../RadioButton/RadioButton'
import styled from 'styled-components'
import useId from '../helpers/useId'

interface RadioButtonFieldProps extends Omit<RadioButtonProps, 'id' | 'onChange'>, MarginProps {
  label: string
  name: string
  labelProps?: object
  id?: string
  onChange?: FieldOnChangeHandler<string>
}

const RadioButtonFieldBase = (props: RadioButtonFieldProps) => {
  const { label, labelProps, id, className, name, onChange, ...radioButtonProps } = splitProps(
    props
  )
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
    top: -3px;
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
}

RadioButtonField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default RadioButtonField
