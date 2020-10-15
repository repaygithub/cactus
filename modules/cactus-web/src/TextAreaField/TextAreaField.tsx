import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { omitMargins } from '../helpers/omit'
import TextArea, { TextAreaProps } from '../TextArea/TextArea'
import { FieldOnChangeHandler } from '../types'

interface TextAreaFieldProps
  extends MarginProps,
    FieldProps,
    Omit<TextAreaProps, 'name' | 'status' | 'onChange'> {
  onChange?: FieldOnChangeHandler<string>
}

const TextAreaFieldBase = (props: TextAreaFieldProps): React.ReactElement => {
  const {
    label,
    labelProps,
    className,
    success,
    warning,
    error,
    tooltip,
    onChange,
    name,
    id,
    disabled,
    autoTooltip,
    ...textAreaProps
  } = omitMargins(props) as Omit<TextAreaFieldProps, keyof MarginProps>

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLTextAreaElement
        onChange(name, currentTarget.value)
      }
    },
    [onChange, name]
  )

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
        <TextArea
          disabled={disabled}
          id={fieldId}
          width="100%"
          status={status}
          onChange={handleChange}
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
  onChange: PropTypes.func,
}

TextAreaField.defaultProps = {
  success: undefined,
  warning: undefined,
  error: undefined,
  tooltip: undefined,
  labelProps: {},
}

export default TextAreaField
