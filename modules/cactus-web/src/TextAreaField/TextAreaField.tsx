import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { extractFieldStyleProps } from '../helpers/omit'
import TextArea, { TextAreaProps } from '../TextArea/TextArea'

interface TextAreaFieldProps extends FieldProps, Omit<TextAreaProps, 'name' | 'status'> {}

const TextAreaFieldBase = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (props: TextAreaFieldProps, ref) => {
    const {
      label,
      labelProps,
      success,
      warning,
      error,
      tooltip,
      tooltipProps,
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
          <TextArea
            disabled={accessibilityDisabled}
            id={fieldId}
            width="100%"
            status={status}
            aria-describedby={ariaDescribedBy}
            name={name}
            {...textAreaProps}
            ref={ref}
          />
        )}
      </AccessibleField>
    )
  }
)

export const TextAreaField = styled(TextAreaFieldBase)`
  position: relative;
`

TextAreaField.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
  value: PropTypes.string,
}

export default TextAreaField
