import React, { useRef } from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { MarginProps, margins } from '../helpers/margins'
import Label from '../Label/Label'
import StatusMessage from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import TextArea, { Status, TextAreaProps } from '../TextArea/TextArea'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface TextAreaFieldProps extends MarginProps, Omit<TextAreaProps, 'status' | 'onChange'> {
  label: string
  name: string
  labelProps?: object
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  onChange?: FieldOnChangeHandler<string>
}

const TextAreaFieldBase = (props: TextAreaFieldProps) => {
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
    ...textAreaProps
  } = props

  const ref = useRef<HTMLDivElement | null>(null)
  let containerWidth = undefined
  if (ref.current) {
    containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
  }

  let status: Status | null = null
  if (success && !warning && !error) {
    status = 'success'
  } else if (warning && !success && !error) {
    status = 'warning'
  } else if (error && !success && !warning) {
    status = 'error'
  }

  const textAreaId = useId(id)
  const statusId = status ? `${textAreaId}-status` : ''
  const tipId = tooltip ? `${textAreaId}-tip` : ''

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLTextAreaElement
        onChange(name, currentTarget.value)
      }
    },
    [onChange, name]
  )

  return (
    <div className={className} ref={ref}>
      <Label htmlFor={textAreaId} {...labelProps}>
        {label}
      </Label>
      {tooltip && <Tooltip label={tooltip} maxWidth={containerWidth} />}
      <TextArea
        id={textAreaId}
        width="100%"
        status={status}
        onChange={handleChange}
        aria-describedby={`${tipId} ${statusId}`}
        {...textAreaProps}
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

export const TextAreaField = styled(TextAreaFieldBase)`
  position: relative;
  width: ${p => p.width || 'auto'};

  ${Label} {
    position: relative;
    bottom: 4px;
    padding-left: 16px;
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

TextAreaField.defaultProps = {
  success: undefined,
  warning: undefined,
  error: undefined,
  tooltip: undefined,
  labelProps: {},
}

export default TextAreaField
