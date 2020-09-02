import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import handleEvent from '../helpers/eventHandler'
import { omitMargins } from '../helpers/omit'
import { TextInput, TextInputProps } from '../TextInput/TextInput'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler } from '../types'

interface TextInputFieldProps
  extends MarginProps,
    FieldProps,
    Omit<TextInputProps, 'name' | 'status' | 'onChange' | 'onFocus' | 'onBlur'> {
  onChange?: FieldOnChangeHandler<string>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
}

const TextInputFieldBase = (props: TextInputFieldProps): React.ReactElement => {
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
    disabled,
    ...inputProps
  } = omitMargins(props) as Omit<TextInputFieldProps, keyof MarginProps>

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLInputElement
        onChange(name, currentTarget.value)
      }
    },
    [onChange, name]
  )

  const handleFocus = (): void => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (): void => {
    handleEvent(onBlur, name)
  }

  return (
    <AccessibleField
      disabled={disabled}
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
      {(
        { fieldId, status, ariaDescribedBy, disabled },
        handleFieldBlur,
        handleFieldFocus
      ): React.ReactElement => (
        <TextInput
          {...inputProps}
          disabled={disabled}
          id={fieldId}
          width="100%"
          status={status}
          onChange={handleChange}
          onFocus={() => {
            handleFocus(), handleFieldFocus()
          }}
          onBlur={() => {
            handleBlur(), handleFieldBlur()
          }}
          name={name}
          aria-describedby={ariaDescribedBy}
        />
      )}
    </AccessibleField>
  )
}

export const TextInputField = styled(TextInputFieldBase)`
  position: relative;
  width: ${(p): string | number => p.width || 'auto'};
  ${margin}
`

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
