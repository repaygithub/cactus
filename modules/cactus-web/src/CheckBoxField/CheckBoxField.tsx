import React from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useId from '../helpers/useId'

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
    <FieldWrapper className={className}>
      <CheckBox {...checkboxProps} id={checkboxId} name={name} onChange={handleChange} />
      <Label htmlFor={checkboxId} {...labelProps}>
        {label}
      </Label>
    </FieldWrapper>
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

  ${margins}
`

// @ts-ignore
CheckBoxField.propTypes = {
  label: PropTypes.string.isRequired,
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
