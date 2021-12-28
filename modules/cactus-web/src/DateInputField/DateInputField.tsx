import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import DateInput, { DateInputProps } from '../DateInput/DateInput'
import { extractFieldStyleProps } from '../helpers/omit'

interface DateInputFieldProps extends FieldProps, Omit<DateInputProps, 'id'> {
  className?: string
  id?: string
  invalidDateLabel?: React.ReactNode
}

function DateInputFieldBase(props: DateInputFieldProps): React.ReactElement {
  const {
    id,
    name,
    label,
    labelProps,
    tooltip,
    tooltipProps,
    success,
    warning,
    error,
    disabled,
    autoTooltip,
    disableTooltip,
    alignTooltip,
    invalidDateLabel = 'The date you have selected is invalid. Please pick another date.',
    ...rest
  } = props
  const styleProps = extractFieldStyleProps(rest)

  const [invalidDate, setInvalidDate] = useState<boolean>(false)

  const onInvalidDate = (isDateInvalid: boolean) => {
    setInvalidDate(isDateInvalid)
  }

  return (
    <AccessibleField
      disabled={disabled}
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      tooltip={tooltip}
      tooltipProps={tooltipProps}
      error={invalidDate ? invalidDateLabel : error}
      warning={!invalidDate && warning}
      success={!invalidDate && success}
      autoTooltip={autoTooltip}
      disableTooltip={disableTooltip}
      alignTooltip={alignTooltip}
      {...styleProps}
    >
      {({
        fieldId,
        status,
        labelId,
        ariaDescribedBy,
        disabled: accessibilityDisabled,
      }): React.ReactElement => (
        <DateInput
          disabled={accessibilityDisabled}
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
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  invalidDateLabel: PropTypes.node,
}

export default DateInputField
