import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { AccessibleField } from '../AccessibleField/AccessibleField'
import handleEvent from '../helpers/eventHandler'
import { omitMargins } from '../helpers/omit'
import TextArea, { TextAreaProps } from '../TextArea/TextArea'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'

interface TextAreaFieldProps
  extends MarginProps,
    Omit<TextAreaProps, 'status' | 'onChange' | 'onFocus' | 'onBlur'> {
  label: React.ReactNode
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
    onFocus,
    onBlur,
    name,
    id,
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

  const handleFocus = (): void => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (): void => {
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
      {({ fieldId, status, ariaDescribedBy }): React.ReactElement => (
        <TextArea
          id={fieldId}
          width="100%"
          status={status}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

// @ts-ignore
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
