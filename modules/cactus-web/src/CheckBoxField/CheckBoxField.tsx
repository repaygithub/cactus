import React from 'react'
import styled from 'styled-components'
import Label from '../Label/Label'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import { Omit, FieldOnChangeHandler } from '../types'
import useId from '../helpers/useId'
import { margins, splitProps, MarginProps } from '../helpers/margins'

interface CheckBoxFieldProps extends Omit<CheckBoxProps, 'id' | 'onChange'>, MarginProps {
  label: string
  labelProps?: object
  id?: string
  name: string
  onChange?: FieldOnChangeHandler<boolean>
}

const CheckBoxFieldContainer = styled.div`
  ${Label} {
    cursor: pointer;
    padding-left: 8px;
  }

  ${CheckBox} {
    top: -1px;
  }

  ${margins}
`

const CheckBoxField = (props: CheckBoxFieldProps) => {
  const [componentProps, marginProps] = splitProps<CheckBoxFieldProps>(props)
  const { label, labelProps, id, name, onChange, ...checkboxProps } = componentProps
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
    <CheckBoxFieldContainer {...marginProps}>
      <CheckBox {...checkboxProps} id={checkboxId} name={name} onChange={handleChange} />
      <Label htmlFor={checkboxId} {...labelProps}>
        {label}
      </Label>
    </CheckBoxFieldContainer>
  )
}

export default CheckBoxField
