import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import FileInput, { FileInputProps } from '../FileInput/FileInput'
import { extractFieldStyleProps } from '../helpers/omit'

interface FileInputFieldProps extends FileInputProps, FieldProps {
  className?: string
}

const FileInputFieldBase = (props: FileInputFieldProps): React.ReactElement => {
  const {
    disabled,
    label,
    labelProps,
    id,
    tooltip,
    tooltipProps,
    name,
    success,
    warning,
    error,
    autoTooltip = false,
    disableTooltip,
    alignTooltip,
    ...rest
  } = props
  const styleProps = extractFieldStyleProps(rest)

  return (
    <AccessibleField
      disabled={disabled}
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      tooltip={tooltip}
      tooltipProps={tooltipProps}
      success={success}
      warning={warning}
      error={error}
      autoTooltip={autoTooltip}
      disableTooltip={disableTooltip}
      alignTooltip={alignTooltip}
      {...styleProps}
    >
      {({
        fieldId,
        labelId,
        name: accessibilityName,
        ariaDescribedBy,
        disabled: accessibilityDisabled,
      }) => (
        <FileInput
          {...rest}
          id={fieldId}
          name={accessibilityName}
          disabled={accessibilityDisabled}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
        />
      )}
    </AccessibleField>
  )
}

export const FileInputField = styled(FileInputFieldBase)`
  .field-label-row {
    margin-bottom: 4px;
  }
`

// `styled` HOC somehow messes up the type of the `accept` prop,
// so I'm putting the propTypes on the base component instead.
FileInputFieldBase.propTypes = {
  ...FileInput.propTypes,
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
}

export default FileInputField
