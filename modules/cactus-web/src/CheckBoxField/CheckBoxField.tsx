import React from 'react'
import styled from 'styled-components'
import { space, SpaceProps } from 'styled-system'
import Label from '../Label/Label'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import { Omit } from '../types'
import useId from '../helpers/useId'
import splitProps from '../helpers/splitProps'

interface CheckBoxFieldProps extends Omit<CheckBoxProps, 'id'>, SpaceProps {
  label: string
  labelProps?: object
  id?: string
  name?: string
}

const StyledLabel = styled(Label)`
  position: relative;
  top: 4px;
  left: 8px;
`

const CheckBoxFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;

  ${space}
`

const CheckBoxField = (props: CheckBoxFieldProps) => {
  const [componentProps, marginProps] = splitProps<CheckBoxFieldProps>(props, 'CheckBoxField')
  const { label, labelProps, id, ...checkboxProps } = componentProps
  const checkboxId = useId(id, checkboxProps.name)

  return (
    <CheckBoxFieldContainer {...marginProps}>
      <CheckBox id={checkboxId} {...checkboxProps} />
      <StyledLabel htmlFor={checkboxId} {...labelProps}>
        {label}
      </StyledLabel>
    </CheckBoxFieldContainer>
  )
}

export default CheckBoxField
