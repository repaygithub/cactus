import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import DateInput, { DateInputProps } from '../DateInput/DateInput'
import { omitMargins } from '../helpers/omit'

interface DateInputFieldProps extends FieldProps, Omit<DateInputProps, 'id'> {
  className?: string
  id?: string
  invalidDateLabel?: React.ReactNode
}

function DateInputFieldBase(props: DateInputFieldProps): React.ReactElement {
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
    invalidDateLabel = 'The date you have selected is invalid. Please pick another date.',
    ...rest
  } = omitMargins(props) as Omit<DateInputFieldProps, keyof MarginProps>

  const [invalidDate, setInvalidDate] = useState<boolean>(false)

  const onInvalidDate = (isDateInvalid: boolean) => {
    setInvalidDate(isDateInvalid)
  }

  return (
    <AccessibleField
      disabled={disabled}
      className={className}
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      tooltip={tooltip}
      error={invalidDate ? invalidDateLabel : error}
      warning={!invalidDate && warning}
      success={!invalidDate && success}
      autoTooltip={autoTooltip}
      disableTooltip={disableTooltip}
      alignTooltip={alignTooltip}
    >
      {({ fieldId, status, labelId, ariaDescribedBy, disabled }): React.ReactElement => (
        <DateInput
          disabled={disabled}
          {...rest}
          name={name}
          id={fieldId}
          status={status}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
          onInvalidDate={onInvalidDate}
        />
      )}
    </AccessibleField>
  )
}

export const DateInputField = styled(DateInputFieldBase)`
  ${margin}
  ${width}

  ${DateInput} {
    width: 100%;
  }
`

DateInputField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  invalidDateLabel: PropTypes.node,
}

DateInputField.defaultProps = {
  labelProps: {},
}

export default DateInputField
