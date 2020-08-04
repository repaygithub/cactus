import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import AccessibleField from '../AccessibleField/AccessibleField'
import DateInput from '../DateInput/DateInput'
import { omitMargins } from '../helpers/omit'
import Label from '../Label/Label'
import { Omit } from '../types'

interface DateInputFieldProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.ComponentPropsWithoutRef<typeof DateInput>,
      'id' | 'status' | keyof MarginProps | keyof WidthProps
    > {
  label: React.ReactNode
  labelProps?: Omit<React.ComponentPropsWithoutRef<typeof Label>, 'children'>
  name: string
  className?: string
  id?: string
  success?: string
  warning?: string
  error?: string
  tooltip?: string
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
    ...rest
  } = omitMargins(props) as Omit<DateInputFieldProps, keyof MarginProps>

  return (
    <AccessibleField
      className={className}
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      tooltip={tooltip}
      error={error}
      warning={warning}
      success={success}
    >
      {({ fieldId, status, labelId, ariaDescribedBy }): React.ReactElement => (
        <DateInput
          {...rest}
          name={name}
          id={fieldId}
          status={status}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
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
}

DateInputField.defaultProps = {
  labelProps: {},
}

export default DateInputField
