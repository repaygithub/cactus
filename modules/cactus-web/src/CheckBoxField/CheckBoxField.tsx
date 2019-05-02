import React from 'react'
import styled from 'styled-components'
import Label from '../Label/Label'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import { Omit } from '../types'
import useId from '../helpers/useId'
import { margins, splitProps, MarginProps } from '../helpers/margins'

interface CheckBoxFieldProps extends Omit<CheckBoxProps, 'id'>, MarginProps {
  label: string
  labelProps?: object
  id?: string
  name?: string
}

const CheckBoxFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;

  ${Label} {
    position: relative;
    top: 2px;
    left: 8px;
  }

  ${margins}
`

const CheckBoxField = (props: CheckBoxFieldProps) => {
  const [componentProps, marginProps] = splitProps<CheckBoxFieldProps>(props)
  const { label, labelProps, id, ...checkboxProps } = componentProps
  const checkboxId = useId(id, checkboxProps.name)

  return (
    <CheckBoxFieldContainer {...marginProps}>
      <CheckBox id={checkboxId} {...checkboxProps} />
      <Label htmlFor={checkboxId} {...labelProps}>
        {label}
      </Label>
    </CheckBoxFieldContainer>
  )
}

export default CheckBoxField
