import React from 'react'

import { FieldEventHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useId from '../helpers/useId'

interface CheckBoxFieldProps
  extends Omit<CheckBoxProps, 'id' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled'>,
    MarginProps {
  label: string
  labelProps?: object
  id?: string
  name: string
  onChange?: FieldEventHandler<boolean>
  onFocus?: FieldEventHandler<boolean>
  onBlur?: FieldEventHandler<boolean>
  disabled?: boolean
}

const CheckBoxFieldBase = (props: CheckBoxFieldProps) => {
  const componentProps = splitProps<CheckBoxFieldProps>(props)
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

  const handleEvent = (handler?: FieldEventHandler<boolean>) => {
    return (event: React.FormEvent<HTMLInputElement>) => {
      if (typeof handler === 'function') {
        const target = (event.target as unknown) as HTMLInputElement
        handler(name, target.checked)
      }
    }
  }

  return (
    <FieldWrapper className={className}>
      <CheckBox
        {...checkboxProps}
        id={checkboxId}
        name={name}
        onChange={handleEvent(onChange)}
        onFocus={handleEvent(onFocus)}
        onBlur={handleEvent(onBlur)}
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
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
}

CheckBoxField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default CheckBoxField
