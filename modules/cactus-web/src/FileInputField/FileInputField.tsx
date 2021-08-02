import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import FileInput, { FileInputProps } from '../FileInput/FileInput'
import { extractFieldStyleProps } from '../helpers/omit'
import Label from '../Label/Label'
import Tooltip from '../Tooltip/Tooltip'

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
  position: relative;

  ${Label} {
    display: block;
    position: relative;
    bottom: 4px;
    padding-left: 16px;
    ${(p): string => (p.disabled ? `color: ${p.theme.colors.mediumGray};` : '')}
  }

  ${Tooltip} {
    display: block;
    bottom: 4px;
    font-size: 16px;
    ${(p): string => (p.disabled ? `color: ${p.theme.colors.mediumGray};` : '')}
  }
`

// `styled` HOC somehow messes up the type of the `accept` prop,
// so I'm putting the propTypes on the base component instead.
FileInputFieldBase.propTypes = {
  ...FileInput.propTypes,
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  tooltip: PropTypes.node,
}

export default FileInputField
