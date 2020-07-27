import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label from '../Label/Label'
import RadioButton, { RadioButtonProps } from '../RadioButton/RadioButton'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'

export interface RadioButtonFieldProps
  extends Omit<RadioButtonProps, 'id' | 'onChange' | 'onFocus' | 'onBlur'>,
    MarginProps {
  label: React.ReactNode
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
  } = omitMargins(props) as Omit<RadioButtonFieldProps, keyof MarginProps>
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
    cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
  }

  ${margin}
`

// @ts-ignore
RadioButtonField.propTypes = {
  label: PropTypes.node.isRequired,
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
