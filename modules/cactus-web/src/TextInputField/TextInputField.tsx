import React, { useRef } from 'react'

import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { Label, LabelProps } from '../Label/Label'
import { margin, MarginProps } from 'styled-system'
import { omitMargins } from '../helpers/omit'
import { TextInput, TextInputProps } from '../TextInput/TextInput'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
import PropTypes from 'prop-types'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface TextInputFieldProps
  extends MarginProps,
    Omit<TextInputProps, 'status' | 'onChange' | 'onFocus' | 'onBlur'> {
  label: string
  name: string
  labelProps?: LabelProps
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  onChange?: FieldOnChangeHandler<string>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
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
    onFocus,
    onBlur,
    name,
    id,
    ...inputProps
  } = omitMargins(props) as Omit<TextInputFieldProps, keyof MarginProps>

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

  const handleFocus = (event: React.FocusEvent) => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (event: React.FocusEvent) => {
    handleEvent(onBlur, name)
  }

  let containerWidth = undefined
  if (ref.current) {
    containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
  }

  return (
    <FieldWrapper className={className} ref={ref}>
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
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
    </FieldWrapper>
  )
}

export const TextInputField = styled(TextInputFieldBase)`
  position: relative;
  width: ${p => p.width || 'auto'};

  ${Label} {
    position: relative;
    margin-bottom: 4px;
    padding-left: 16px;
  }

  ${Tooltip} {
    position: absolute;
    top: -2px;
    right: 8px
    font-size: 16px;
  }

  ${StatusMessage} {
    margin-left: 16px;
    margin-top: 4px;
  }

  ${margin}
`

// @ts-ignore
TextInputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

TextInputField.defaultProps = {
  error: undefined,
  labelProps: {},
  success: undefined,
  tooltip: undefined,
  warning: undefined,
}

export default TextInputField
