import React, { useRef } from 'react'

import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import FileInput, { FileInputProps } from '../FileInput/FileInput'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface FileInputFieldProps extends FileInputProps, MarginProps {
  className?: string
  label: string
  labelProps?: object
  tooltip?: string
}

const FileInputFieldBase = (props: FileInputFieldProps) => {
  const { className, label, labelProps, id, tooltip, ...fileInputProps } = omitMargins(
    props
  ) as Omit<FileInputFieldProps, keyof MarginProps>
  const inputId = useId(id, 'file-input')
  const tipId = tooltip ? `${inputId}-tip` : ''
  const containerRef = useRef<HTMLDivElement | null>(null)

  let tooltipWidth = undefined
  if (containerRef.current && tooltip) {
    tooltipWidth = `${containerRef.current.getBoundingClientRect().width - 32}px`
  }

  return (
    <FieldWrapper className={className} ref={containerRef}>
      <Label htmlFor={inputId} {...labelProps}>
        {label}
      </Label>
      {tooltip && <Tooltip id={tipId} label={tooltip} maxWidth={tooltipWidth} />}
      <FileInput id={inputId} aria-describedby={tipId} {...fileInputProps} />
    </FieldWrapper>
  )
}

export const FileInputField = styled(FileInputFieldBase)`
  position: relative;

  ${Label} {
    display: block;
    position: relative;
    bottom: 4px;
    padding-left: 16px;
  }

  ${Tooltip} {
    position: absolute;
    top: -2px;
    right: 8px
    font-size: 16px;
  }

  ${margin}
`

// @ts-ignore
FileInputField.propTypes = {
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  tooltip: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.shape({
    delete: PropTypes.string,
    retry: PropTypes.string,
    loading: PropTypes.string,
    loaded: PropTypes.string,
  }),
  buttonText: PropTypes.string,
  prompt: PropTypes.string,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  rawFiles: PropTypes.bool,
  multiple: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      status: PropTypes.oneOf(['loading', 'loaded', 'error']),
      errorMsg: PropTypes.string,
    })
  ),
}

export default FileInputField
