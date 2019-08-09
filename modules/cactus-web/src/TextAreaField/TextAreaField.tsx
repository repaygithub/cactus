import React, { useRef } from 'react'

import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
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
  onChange?: FieldOnChangeHandler<string>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
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

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLTextAreaElement
        onChange(name, currentTarget.value)
      }
    },
    [onChange, name]
  )

  const handleFocus = (event: React.FocusEvent) => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (event: React.FocusEvent) => {
    handleEvent(onBlur, name)
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
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
