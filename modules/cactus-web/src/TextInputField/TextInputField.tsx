import React, { useState } from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { FieldOnChangeHandler, Omit } from '../types'
import { Label } from '../Label/Label'
import { MarginProps, margins } from '../helpers/margins'
import { Status, TextInput, TextInputProps } from '../TextInput/TextInput'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'

interface TextInputFieldProps extends MarginProps, Omit<TextInputProps, 'status' | 'onChange'> {
  label: string
  name: string
  labelProps?: object
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  onChange?: FieldOnChangeHandler<string>
}

interface StatusLabelProps {
  status: Status
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${p => p.theme.colors.success};
    background: ${p => p.theme.colors.success};
    color: ${p => p.theme.colors.white};
  `,
  warning: css`
    border-color: ${p => p.theme.colors.warning};
    background-color: ${p => p.theme.colors.warning};
    color: ${p => p.theme.colors.darkestContrast};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
    background-color: ${p => p.theme.colors.error};
    color: ${p => p.theme.colors.white};
  `,
}

const statusColors = (props: StatusLabelProps) => {
  const { status } = props
  return statusMap[status]
}

const StatusLabel = styled.div<StatusLabelProps>`
  border-radius: 0 8px 8px 8px;
  padding: 8px 16px 8px 16px;
  position: relative;
  top: 4px;
  min-height: 16px;
  font-size: 15px;
  box-sizing: border-box;
  word-break: break-all;

  span {
    position: relative;
    display: inline-block;
    bottom: 2px;
    vertical-align: middle;
  }

  ${statusColors}
`

const TextInputFieldBase = (props: TextInputFieldProps) => {
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
    ...inputProps
  } = props

  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  let status: Status | null = null
  if (success && !warning && !error) {
    status = 'success'
  } else if (warning && !success && !error) {
    status = 'warning'
  } else if (error && !success && !warning) {
    status = 'error'
  }

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLInputElement
        onChange(name, currentTarget.value)
      }
    },
    [onChange, name]
  )

  let containerWidth = undefined
  if (ref) {
    containerWidth = `${ref.getBoundingClientRect().width - 32}px`
  }

  return (
    <div
      className={className}
      ref={ref => {
        if (ref) {
          setRef(ref)
        }
      }}
    >
      <Label {...labelProps}>{label}</Label>
      {tooltip && <Tooltip label={tooltip} maxWidth={containerWidth} />}
      <TextInput {...inputProps} width="100%" status={status} onChange={handleChange} />
      {status === 'success' && (
        <StatusLabel status="success">
          <span>{success}</span>
        </StatusLabel>
      )}
      {status === 'warning' && (
        <StatusLabel status="warning">
          <span>{warning}</span>
        </StatusLabel>
      )}
      {status === 'error' && (
        <StatusLabel status="error">
          <span>{error}</span>
        </StatusLabel>
      )}
    </div>
  )
}

export const TextInputField = styled(TextInputFieldBase)`
  position: relative;
  width: ${p => p.width || 'auto'};

  ${Label} {
    position: relative;
    bottom: 4px;
    padding-left: 15px;
  }

  ${Tooltip} {
    position: absolute;
    right: 8px
    font-size: 16px;
  }

  ${margins}
`

TextInputField.defaultProps = {
  error: undefined,
  labelProps: {},
  success: undefined,
  tooltip: undefined,
  warning: undefined,
}

export default TextInputField
