import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { omitMargins } from '../helpers/omit'
import TextArea, { TextAreaProps } from '../TextArea/TextArea'

interface TextAreaFieldProps
  extends MarginProps,
    FieldProps,
    Omit<TextAreaProps, 'name' | 'status'> {}

const TextAreaFieldBase = (props: TextAreaFieldProps): React.ReactElement => {
  const {
    label,
    labelProps,
    className,
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
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    ...textAreaProps
  } = omitMargins(props) as Omit<TextAreaFieldProps, keyof MarginProps>

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
      disableTooltip={disableTooltip}
      alignTooltip={alignTooltip}
      flex={flex}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      flexBasis={flexBasis}
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
  width: ${(p): string => p.width || 'auto'};
  ${margin}
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
