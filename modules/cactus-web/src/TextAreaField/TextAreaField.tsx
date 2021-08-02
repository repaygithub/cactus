import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { extractFieldStyleProps } from '../helpers/omit'
import TextArea, { TextAreaProps } from '../TextArea/TextArea'

interface TextAreaFieldProps extends FieldProps, Omit<TextAreaProps, 'name' | 'status'> {}

const TextAreaFieldBase = (props: TextAreaFieldProps): React.ReactElement => {
  const {
    label,
    labelProps,
    success,
    warning,
    error,
    tooltip,
    name,
    id,
    disabled,
    autoTooltip,
    disableTooltip,
    alignTooltip,
    ...textAreaProps
  } = props
  const styleProps = extractFieldStyleProps(textAreaProps)

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
        <TextArea
          disabled={accessibilityDisabled}
          id={fieldId}
          width="100%"
          status={status}
          aria-describedby={ariaDescribedBy}
          name={name}
          {...textAreaProps}
        />
      )}
    </AccessibleField>
  )
}

export const TextAreaField = styled(TextAreaFieldBase)`
  position: relative;
`

TextAreaField.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  value: PropTypes.string,
}

TextAreaField.defaultProps = {
  success: undefined,
  warning: undefined,
  error: undefined,
  tooltip: undefined,
  labelProps: {},
}

export default TextAreaField
