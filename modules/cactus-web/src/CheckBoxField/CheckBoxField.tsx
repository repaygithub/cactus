import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label from '../Label/Label'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'

interface CheckBoxFieldProps
  extends Omit<CheckBoxProps, 'id' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled'>,
    MarginProps {
  label: React.ReactNode
  labelProps?: object
  id?: string
  name: string
  onChange?: FieldOnChangeHandler<boolean>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
  disabled?: boolean
}

const CheckBoxFieldBase = (props: CheckBoxFieldProps) => {
  const componentProps = omitMargins(props) as Omit<CheckBoxFieldProps, keyof MarginProps>
  const {
    label,
    labelProps,
    id,
    name,
    onChange,
    onBlur,
    onFocus,
    className,
    ...checkboxProps
  } = componentProps
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

  const handleFocus = (event: React.FocusEvent) => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (event: React.FocusEvent) => {
    handleEvent(onBlur, name)
  }

  return (
    <FieldWrapper className={className}>
      <CheckBox
        {...checkboxProps}
        id={checkboxId}
        name={name}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
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
    cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
  }

  ${margin}
`

// @ts-ignore
CheckBoxField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
}

CheckBoxField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default CheckBoxField
