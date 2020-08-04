import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import AccessibleField from '../AccessibleField/AccessibleField'
import { omitMargins } from '../helpers/omit'
import { LabelProps } from '../Label/Label'
import Select, { OptionType, SelectProps, SelectValueType } from '../Select/Select'
import { FieldOnChangeHandler, Omit } from '../types'

interface SelectFieldProps
  extends MarginProps,
    WidthProps,
    Omit<SelectProps, 'id' | 'onChange' | keyof MarginProps | keyof WidthProps> {
  label: React.ReactNode
  labelProps?: LabelProps
  name: string
  options: (OptionType | string)[]
  className?: string
  id?: string
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  multiple?: boolean
  onChange?: FieldOnChangeHandler<SelectValueType>
}

const SelectFieldBase: React.FC<SelectFieldProps> = (props): React.ReactElement => {
  const {
    className,
    id,
    name,
    label,
    labelProps,
    tooltip,
    success,
    warning,
    error,
    width,
    ...rest
  } = omitMargins(props) as Omit<SelectFieldProps, keyof MarginProps>

  return (
    <AccessibleField
      className={className}
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      tooltip={tooltip}
      success={success}
      warning={warning}
      error={error}
      width={width}
    >
      {({ fieldId, labelId, name, ariaDescribedBy, status }): React.ReactElement => (
        <Select
          {...rest}
          status={status}
          name={name}
          id={fieldId}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
        />
      )}
    </AccessibleField>
  )
}

export const SelectField = styled(SelectFieldBase)`
  position: relative;
  ${margin}
  ${width}

  ${Select} {
    width: 100%;
  }
`

// @ts-ignore
SelectField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  name: PropTypes.string.isRequired,
  // @ts-ignore
  options: Select.propTypes.options,
  className: PropTypes.string,
  id: PropTypes.string,
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  onChange: PropTypes.func,
}

export default SelectField
