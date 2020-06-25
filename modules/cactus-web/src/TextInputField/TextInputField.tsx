import React from 'react'

import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { LabelProps } from '../Label/Label'
import { margin, MarginProps } from 'styled-system'
import { omitMargins } from '../helpers/omit'
import { TextInput, TextInputProps } from '../TextInput/TextInput'
import AccessibleField from '../AccessibleField/AccessibleField'
import handleEvent from '../helpers/eventHandler'
import PropTypes from 'prop-types'
import styled from 'styled-components'

interface TextInputFieldProps
  extends MarginProps,
    Omit<TextInputProps, 'status' | 'onChange' | 'onFocus' | 'onBlur'> {
  label: React.ReactNode
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
    id,
    name,
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
    ...inputProps
  } = omitMargins(props) as Omit<TextInputFieldProps, keyof MarginProps>

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

  return (
    <AccessibleField
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      className={className}
      success={success}
      warning={warning}
      error={error}
      tooltip={tooltip}
    >
      {({ fieldId, status, ariaDescribedBy }) => (
        <TextInput
          {...inputProps}
          id={fieldId}
          width="100%"
          status={status}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name={name}
          aria-describedby={ariaDescribedBy}
        />
      )}
    </AccessibleField>
  )
}

export const TextInputField = styled(TextInputFieldBase)`
  position: relative;
  width: ${(p) => p.width || 'auto'};
  ${margin}
`

// @ts-ignore
TextInputField.propTypes = {
  label: PropTypes.node.isRequired,
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
