import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import FileInput, { FileInputProps } from '../FileInput/FileInput'
import { omitMargins } from '../helpers/omit'
import Label from '../Label/Label'
import Tooltip from '../Tooltip/Tooltip'

interface FileInputFieldProps extends FileInputProps, MarginProps, FieldProps {
  className?: string
}

const FileInputFieldBase = (props: FileInputFieldProps): React.ReactElement => {
  const {
    className,
    disabled,
    label,
    labelProps,
    id,
    tooltip,
    name,
    success,
    warning,
    error,
    width,
    autoTooltip = false,
    disableTooltip,
    alignTooltip,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    ...rest
  } = omitMargins(props) as Omit<FileInputFieldProps, keyof MarginProps>

  return (
    <AccessibleField
      disabled={disabled}
      className={className}
      id={id}
      name={name}
      label={label}
      labelProps={labelProps}
      tooltip={tooltip}
      success={success}
      warning={warning}
      error={error}
      width={width}
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

  ${margin}
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
