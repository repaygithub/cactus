import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { omitMargins } from '../helpers/omit'
import { TextInput, TextInputProps } from '../TextInput/TextInput'

interface TextInputFieldProps
  extends MarginProps,
    FieldProps,
    Omit<TextInputProps, 'name' | 'status'> {}

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
    disabled,
    autoTooltip,
    ...inputProps
  } = omitMargins(props) as Omit<TextInputFieldProps, keyof MarginProps>

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
      autoTooltip={autoTooltip}
    >
      {({ fieldId, status, ariaDescribedBy, disabled }): React.ReactElement => (
        <TextInput
          {...inputProps}
          disabled={disabled}
          id={fieldId}
          width="100%"
          status={status}
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
}

TextInputField.defaultProps = {
  error: undefined,
  labelProps: {},
  success: undefined,
  tooltip: undefined,
  warning: undefined,
}

export default TextInputField
