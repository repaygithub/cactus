import React from 'react'

import { margin, MarginProps, width, WidthProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import DateInput from '../DateInput/DateInput'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface DateInputFieldProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.ComponentPropsWithoutRef<typeof DateInput>,
      'id' | 'status' | keyof MarginProps | keyof WidthProps
    > {
  label: string
  labelProps?: Omit<React.ComponentPropsWithoutRef<typeof Label>, 'children'>
  name: string
  className?: string
  id?: string
  success?: string
  warning?: string
  error?: string
  tooltip?: string
}

function DateInputFieldBase(props: DateInputFieldProps) {
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

  let status: Status | undefined
  let statusContent: string | undefined
  if (error) {
    status = 'error'
    statusContent = error
  } else if (warning) {
    status = 'warning'
    statusContent = warning
  } else if (success) {
    status = 'success'
    statusContent = success
  }

  const ref = React.useRef<HTMLDivElement | null>(null)
  let containerWidth = undefined
  if (ref.current) {
    containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
  }

  const inputId = useId(id, name)
  const labelId = `${inputId}-label`
  const statusId = status ? `${inputId}-status` : ''
  const tipId = tooltip ? `${inputId}-tip` : ''

  return (
    <FieldWrapper className={className} ref={ref}>
      <Label {...labelProps} id={labelId} htmlFor={inputId}>
        {label}
      </Label>
      {tooltip && <Tooltip label={tooltip} id={tipId} maxWidth={containerWidth} />}
      <DateInput
        name={name}
        id={inputId}
        {...rest}
        status={status}
        aria-labeledby={labelId}
        aria-describedby={`${tipId} ${statusId}`}
      />
      {typeof status !== 'undefined' && (
        <StatusMessage status={status} id={statusId}>
          {statusContent}
        </StatusMessage>
      )}
    </FieldWrapper>
  )
}

export const DateInputField = styled(DateInputFieldBase)`
  position: relative;
  ${margin}
  ${width}

  ${Label} {
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 28px;
  }

  ${Tooltip}  {
    position: absolute;
    right: 8px
    top: 2px;
    font-size: 16px;
  }

  ${DateInput} {
    width: 100%;
  }

  ${StatusMessage} {
    margin-left: 16px;
    margin-top: 4px;
  }
`

DateInputField.propTypes = {
  label: PropTypes.string.isRequired,
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
