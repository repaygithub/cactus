import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import FileInput, { FileInputProps, FileObject } from '../FileInput/FileInput'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import Tooltip from '../Tooltip/Tooltip'
import { Omit } from '../types'

interface FileInputFieldProps extends FileInputProps, MarginProps {
  className?: string
  label: React.ReactNode
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  tooltip?: string
}

const FileInputFieldBase = (props: FileInputFieldProps): React.ReactElement => {
  const { className, disabled, label, labelProps, id, tooltip, ...fileInputProps } = omitMargins(
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
      <Label {...labelProps} htmlFor={inputId}>
        {label}
      </Label>
      {tooltip && (
        <Tooltip id={tipId} label={tooltip} maxWidth={tooltipWidth} disabled={disabled} />
      )}
      <FileInput id={inputId} aria-describedby={tipId} disabled={disabled} {...fileInputProps} />
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
  tooltip: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.arrayOf(PropTypes.string) as PropTypes.Validator<string[] | undefined>,
  labels: PropTypes.shape({
    delete: PropTypes.string as PropTypes.Validator<string | undefined>,
    loading: PropTypes.string as PropTypes.Validator<string | undefined>,
    loaded: PropTypes.string as PropTypes.Validator<string | undefined>,
  }),
  buttonText: PropTypes.string,
  prompt: PropTypes.string,
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
