import React from 'react'
import styled from 'styled-components'
import Label from '../Label/Label'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import { Omit, FieldOnChangeHandler } from '../types'
import useId from '../helpers/useId'
import { margins, splitProps, MarginProps } from '../helpers/margins'

interface CheckBoxFieldProps
  extends Omit<CheckBoxProps, 'id' | 'onChange' | 'disabled'>,
    MarginProps {
  label: string
  labelProps?: object
  id?: string
  name: string
  onChange?: FieldOnChangeHandler<boolean>
  disabled?: boolean
}

const CheckBoxFieldBase = (props: CheckBoxFieldProps) => {
  const componentProps = splitProps<CheckBoxFieldProps>(props)
  const { label, labelProps, id, name, onChange, className, ...checkboxProps } = componentProps
  const checkboxId = useId(id, name)
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
      <CheckBox {...checkboxProps} id={checkboxId} name={name} onChange={handleChange} />
      <Label htmlFor={checkboxId} {...labelProps}>
        {label}
      </Label>
    </div>
  )
}

export const CheckBoxField = styled(CheckBoxFieldBase)`
  & + & {
    margin-top: 8px;
  }

  ${Label} {
    cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
  }

  ${CheckBox} {
    top: -1px;
  }

  ${margins}
`

CheckBoxField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default CheckBoxField
