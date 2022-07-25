import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { extractFieldStyleProps } from '../helpers/omit'
import { FlexItemProps } from '../helpers/styled'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'

export interface CheckBoxFieldProps extends CheckBoxProps, FlexItemProps {
  label: React.ReactNode
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  name?: string
  disabled?: boolean
}

const CheckBoxFieldBase = React.forwardRef<HTMLInputElement, CheckBoxFieldProps>((props, ref) => {
  const { label, labelProps, id, name, ...checkboxProps } = props
  const styleProps = extractFieldStyleProps(checkboxProps)
  const checkboxId = useId(id, name)

  return (
    <FieldWrapper {...styleProps} $gap={3}>
      <CheckBox {...checkboxProps} ref={ref} id={checkboxId} name={name} />
      <Label {...labelProps} htmlFor={checkboxId}>
        {label}
      </Label>
    </FieldWrapper>
  )
})

export const CheckBoxField = styled(CheckBoxFieldBase)`
  ${Label} {
    cursor: ${(p): string => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }
`

CheckBoxField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
}

export default CheckBoxField
