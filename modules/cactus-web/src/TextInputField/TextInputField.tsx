import React, { useRef } from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { Label, LabelProps } from '../Label/Label'
import { MarginProps, margins } from '../helpers/margins'
import { TextInput, TextInputProps } from '../TextInput/TextInput'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface TextInputFieldProps extends MarginProps, Omit<TextInputProps, 'status' | 'onChange'> {
  label: string
  name: string
  labelProps?: LabelProps
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  onChange?: FieldOnChangeHandler<string>
}

const TextInputFieldBase = (props: TextInputFieldProps) => {
  const {
    label,
    labelProps,
    className,
    success,
    warning,
    error,
    tooltip,
    onChange,
    name,
    id,
    ...inputProps
  } = props

  const ref = useRef<HTMLDivElement | null>(null)

  let status: Status | null = null
  if (success && !warning && !error) {
    status = 'success'
  } else if (warning && !success && !error) {
    status = 'warning'
  } else if (error && !success && !warning) {
    status = 'error'
  }

  const inputId = useId(id)
  const statusId = status ? `${inputId}-status` : ''
  const tipId = tooltip ? `${inputId}-tip` : ''

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLInputElement
        onChange(name, currentTarget.value)
      }
    },
    [onChange, name]
  )

  let containerWidth = undefined
  if (ref.current) {
    containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
  }

  return (
    <div className={className} ref={ref}>
      <Label htmlFor={inputId} {...labelProps}>
        {label}
      </Label>
      {tooltip && <Tooltip id={tipId} label={tooltip} maxWidth={containerWidth} />}
      <TextInput
        {...inputProps}
        id={inputId}
        width="100%"
        status={status}
        onChange={handleChange}
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

export const TextInputField = styled(TextInputFieldBase)`
  position: relative;
  width: ${p => p.width || 'auto'};

  ${Label} {
    position: relative;
    bottom: 4px;
    padding-left: 15px;
  }

  ${Tooltip} {
    position: absolute;
    right: 8px
    font-size: 16px;
  }

  ${StatusMessage} {
    margin-top: 4px;
  }

  ${margins}
`

TextInputField.defaultProps = {
  error: undefined,
  labelProps: {},
  success: undefined,
  tooltip: undefined,
  warning: undefined,
}

export default TextInputField
