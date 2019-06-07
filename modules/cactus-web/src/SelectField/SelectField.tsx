import React from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import { width, WidthProps } from 'styled-system'
import Label from '../Label/Label'
import Select, { OptionType, SelectProps } from '../Select/Select'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface SelectFieldProps extends MarginProps, WidthProps, Omit<SelectProps, 'id'> {
  label: string
  labelProps?: object
  name: string
  options: string[] | OptionType[]
  className?: string
  id?: string
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  onChange?: FieldOnChangeHandler<string>
}

const SelectFieldBase: React.FC<SelectFieldProps> = props => {
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
  } = splitProps(props)
  const fieldId = useId(id, name)
  const tooltipId = tooltip ? `${fieldId}-tip` : ''

  const ref = React.useRef<HTMLDivElement | null>(null)
  let containerWidth = undefined
  if (ref.current) {
    containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
  }

  let status: Status | undefined
  if (success && !warning && !error) {
    status = 'success'
  } else if (warning && !success && !error) {
    status = 'warning'
  } else if (error && !success && !warning) {
    status = 'error'
  }

  const inputId = useId(id, name)
  const statusId = status ? `${inputId}-status` : ''
  const tipId = tooltip ? `${inputId}-tip` : ''

  return (
    <div className={className} ref={ref}>
      <Label {...labelProps} htmlFor={fieldId}>
        {label}
      </Label>
      {tooltip && <Tooltip label={tooltip} id={tipId} maxWidth={containerWidth} />}
      <Select
        {...rest}
        status={status}
        name={name}
        id={fieldId}
        aria-describedby={`${tipId} ${statusId}`}
      />
      {status === 'success' && (
        <StatusMessage status="success" id={statusId}>
          <span>{success}</span>
        </StatusMessage>
      )}
      {status === 'warning' && (
        <StatusMessage status="warning" id={statusId}>
          <span>{warning}</span>
        </StatusMessage>
      )}
      {status === 'error' && (
        <StatusMessage status="error" id={statusId}>
          <span>{error}</span>
        </StatusMessage>
      )}
    </div>
  )
}

export const SelectField = styled(SelectFieldBase)`
  position: relative;
  ${margins}
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

  ${Select} {
    width: 100%;
  }

  ${StatusMessage} {
    margin-top: 4px;
  }
`

export default SelectField
