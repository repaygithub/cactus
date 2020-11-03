import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { omitMargins } from '../helpers/omit'
import Select, { OptionType, SelectProps, SelectValueType } from '../Select/Select'
import { FieldOnChangeHandler } from '../types'

interface SelectFieldProps
  extends MarginProps,
    WidthProps,
    FieldProps,
    Omit<SelectProps, 'id' | 'onChange' | keyof MarginProps | keyof WidthProps> {
  options: (OptionType | string | number)[]
  className?: string
  id?: string
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
    disabled,
    autoTooltip,
    ...rest
  } = omitMargins(props) as Omit<SelectFieldProps, keyof MarginProps>
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <AccessibleField
      disabled={disabled}
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
      autoTooltip={autoTooltip}
      isOpen={isOpen}
    >
      {({ fieldId, labelId, name, ariaDescribedBy, status, disabled }): React.ReactElement => (
        <Select
          {...rest}
          disabled={disabled}
          status={status}
          name={name}
          id={fieldId}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
          getSelectOpen={(e) => setIsOpen(e)}
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
