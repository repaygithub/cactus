import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import { FieldOnChangeHandler } from '../types'

export interface CheckBoxFieldProps
  extends Omit<CheckBoxProps, 'id' | 'onChange' | 'disabled'>,
    MarginProps {
  label: React.ReactNode
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  name: string
  onChange?: FieldOnChangeHandler<boolean>
  disabled?: boolean
}

const CheckBoxFieldBase = React.forwardRef<HTMLInputElement, CheckBoxFieldProps>((props, ref) => {
  const componentProps = omitMargins(props) as Omit<CheckBoxFieldProps, keyof MarginProps>
  const { label, labelProps, id, name, onChange, className, ...checkboxProps } = componentProps
  const checkboxId = useId(id, name)

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (typeof onChange === 'function') {
        const target = (event.target as unknown) as HTMLInputElement
        onChange(name, target.checked)
      }
    },
    [name, onChange]
  )

  return (
    <FieldWrapper className={className}>
      <CheckBox {...checkboxProps} ref={ref} id={checkboxId} name={name} onChange={handleChange} />
      <Label {...labelProps} htmlFor={checkboxId}>
        {label}
      </Label>
    </FieldWrapper>
  )
})

export const CheckBoxField = styled(CheckBoxFieldBase)`
  & + & {
    margin-top: 8px;
  }

  ${Label} {
    cursor: ${(p): string => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }

  ${margin}
`

CheckBoxField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

CheckBoxField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default CheckBoxField
