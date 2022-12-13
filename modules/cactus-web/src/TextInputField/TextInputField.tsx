import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { extractFieldStyleProps } from '../helpers/omit'
import TextInput, { TextInputProps } from '../TextInput/TextInput'

interface TextInputFieldProps extends FieldProps, Omit<TextInputProps, 'name' | 'status'> {}

const TextInputFieldBase = React.forwardRef<HTMLInputElement, TextInputFieldProps>(
  (props: TextInputFieldProps, ref) => {
    const {
      id,
      name,
      label,
      labelProps,
      success,
      warning,
      error,
      tooltip,
      tooltipProps,
      disabled,
      autoTooltip,
      disableTooltip,
      alignTooltip,
      ...inputProps
    } = props
    const styleProps = extractFieldStyleProps(inputProps)

    return (
      <AccessibleField
        disabled={disabled}
        id={id}
        name={name}
        label={label}
        labelProps={labelProps}
        success={success}
        warning={warning}
        error={error}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        autoTooltip={autoTooltip}
        disableTooltip={disableTooltip}
        alignTooltip={alignTooltip}
        {...styleProps}
      >
        {({
          fieldId,
          status,
          ariaDescribedBy,
          disabled: accessibilityDisabled,
        }): React.ReactElement => (
          <TextInput
            ref={ref}
            {...inputProps}
            disabled={accessibilityDisabled}
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
)

export const TextInputField = styled(TextInputFieldBase)`
  position: relative;
`

TextInputField.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
}

export default TextInputField
