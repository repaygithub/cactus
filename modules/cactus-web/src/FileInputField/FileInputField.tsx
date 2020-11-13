import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import FileInput, { FileInputProps, FileObject } from '../FileInput/FileInput'
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
    >
      {({ fieldId, labelId, name, ariaDescribedBy, disabled }) => (
        <FileInput
          {...rest}
          id={fieldId}
          name={name}
          disabled={disabled}
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
    position: absolute;
    top: -2px;
    right: 8px;
    font-size: 16px;
    ${(p): string => (p.disabled ? `color: ${p.theme.colors.mediumGray};` : '')}
  }

  ${margin}
`

FileInputField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  tooltip: PropTypes.node,
  name: PropTypes.string.isRequired,
  accept: PropTypes.arrayOf(PropTypes.string) as PropTypes.Validator<string[] | undefined>,
  labels: PropTypes.shape({
    delete: PropTypes.string as PropTypes.Validator<string | undefined>,
    loading: PropTypes.string as PropTypes.Validator<string | undefined>,
    loaded: PropTypes.string as PropTypes.Validator<string | undefined>,
  }),
  buttonText: PropTypes.node,
  prompt: PropTypes.node,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  rawFiles: PropTypes.bool,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      status: PropTypes.oneOf(['loading', 'loaded', 'error']),
      errorMsg: PropTypes.string,
    })
  ) as PropTypes.Validator<FileObject[] | undefined>,
}

export default FileInputField
