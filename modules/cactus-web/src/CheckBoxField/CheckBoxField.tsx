import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Label from '../Label/Label'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import { Omit } from '../types'
import useId from '../helpers/useId'

interface CheckBoxFieldProps extends Omit<CheckBoxProps, 'id'> {
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
`

const CheckBoxField = (props: CheckBoxFieldProps) => {
  const { label, labelProps, id, ...checkboxProps } = props
  const checkboxId = useId(id, checkboxProps.name)

  return (
    <CheckBoxFieldContainer>
      <CheckBox id={checkboxId} {...checkboxProps} />
      <Label htmlFor={checkboxId} {...labelProps}>
        {label}
      </Label>
    </CheckBoxFieldContainer>
  )
}

export default CheckBoxField
