import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width as styledSystemWidth, WidthProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { omitMargins } from '../helpers/omit'
import Select, { SelectProps } from '../Select/Select'

interface SelectFieldProps
  extends MarginProps,
    WidthProps,
    FieldProps,
    Omit<SelectProps, 'id' | keyof MarginProps | keyof WidthProps> {
  className?: string
  id?: string
  multiple?: boolean
}

type SelectFieldType = React.FC<SelectFieldProps> & { Option: typeof Select.Option }

const SelectFieldBase: SelectFieldType = (props): React.ReactElement => {
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
    disableTooltip,
    alignTooltip,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
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
      disableTooltip={disableTooltip}
      alignTooltip={alignTooltip}
      flex={flex}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      flexBasis={flexBasis}
    >
      {({
        fieldId,
        labelId,
        name: accessibilityName,
        ariaDescribedBy,
        status,
        disabled: accessibilityDisabled,
      }): React.ReactElement => (
        <Select
          {...rest}
          disabled={accessibilityDisabled}
          status={status}
          name={accessibilityName}
          id={fieldId}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
          onDropdownToggle={(newStateOpen) => setIsOpen(newStateOpen)}
        />
      )}
    </AccessibleField>
  )
}

SelectFieldBase.Option = Select.Option

export const SelectField = styled(SelectFieldBase)`
  position: relative;
  ${margin}
  ${styledSystemWidth}

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
}

export default SelectField
