import React, { useRef } from 'react'

import { FieldEventHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import StatusMessage from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import TextArea, { Status, TextAreaProps } from '../TextArea/TextArea'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface TextAreaFieldProps
  extends MarginProps,
    Omit<TextAreaProps, 'status' | 'onChange' | 'onFocus' | 'onBlur'> {
  label: string
  name: string
  labelProps?: object
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  onChange?: FieldEventHandler<string>
  onFocus?: FieldEventHandler<string>
  onBlur?: FieldEventHandler<string>
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
    onFocus,
    onBlur,
    name,
    id,
    ...textAreaProps
  } = splitProps(props)

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

  const handleEvent = (handler?: FieldEventHandler<string>) => {
    return (event: React.FormEvent<HTMLTextAreaElement>) => {
      if (typeof handler === 'function') {
        const target = (event.target as unknown) as HTMLTextAreaElement
        handler(name, target.value)
      }
    }
  }

  return (
    <FieldWrapper className={className} ref={ref}>
      <Label htmlFor={textAreaId} {...labelProps}>
        {label}
      </Label>
      {tooltip && <Tooltip label={tooltip} maxWidth={containerWidth} />}
      <TextArea
        id={textAreaId}
        width="100%"
        status={status}
        onChange={handleEvent(onChange)}
        onFocus={handleEvent(onFocus)}
        onBlur={handleEvent(onBlur)}
        aria-describedby={`${tipId} ${statusId}`}
        name={name}
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
    </FieldWrapper>
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
    top: -2px;
    right: 8px
    font-size: 16px;
  }

  ${StatusMessage} {
    margin-top: 4px;
  }

  ${margins}
`

// @ts-ignore
TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

TextAreaField.defaultProps = {
  success: undefined,
  warning: undefined,
  error: undefined,
  tooltip: undefined,
  labelProps: {},
}

export default TextAreaField
