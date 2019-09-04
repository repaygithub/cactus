import React from 'react'

import { FieldOnChangeHandler, Omit } from '../types'
import { margin, MarginProps, width, WidthProps } from 'styled-system'
import { omitMargins } from '../helpers/omit'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label from '../Label/Label'
import PropTypes from 'prop-types'
import Select, { OptionType, SelectProps, SelectValueType } from '../Select/Select'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import Tooltip from '../Tooltip/Tooltip'
import useId from '../helpers/useId'

interface SelectFieldProps
  extends MarginProps,
    WidthProps,
    Omit<SelectProps, 'id' | 'onChange' | keyof MarginProps | keyof WidthProps> {
  label: string
  labelProps?: object
  name: string
  options: Array<OptionType | string>
  className?: string
  id?: string
  success?: string
  warning?: string
  error?: string
  tooltip?: string
  multiple?: boolean
  onChange?: FieldOnChangeHandler<SelectValueType>
}

const SelectFieldBase: React.FC<SelectFieldProps> = props => {
  const {
    className,
    id,
    name,
    label,
    labelProps,
    tooltip,
    success,
    warning,
    error,
    width,
    ...rest
  } = omitMargins(props) as Omit<SelectFieldProps, keyof MarginProps>
  const fieldId = useId(id, name)

  const ref = React.useRef<HTMLDivElement | null>(null)
  let containerWidth = undefined
  if (ref.current) {
    containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
  }

  let status: Status | undefined
  if (success && !warning && !error) {
    status = 'success'
  } else if (warning && !success && !error) {
    status = 'warning'
  } else if (error && !success && !warning) {
    status = 'error'
  }

  const inputId = useId(id, name)
  const statusId = status ? `${inputId}-status` : ''
  const tipId = tooltip ? `${inputId}-tip` : ''

  return (
    <FieldWrapper className={className} ref={ref}>
      <Label {...labelProps} htmlFor={fieldId}>
        {label}
      </Label>
      {tooltip && <Tooltip label={tooltip} id={tipId} maxWidth={containerWidth} />}
      <Select
        {...rest}
        status={status}
        name={name}
        id={fieldId}
        aria-describedby={`${tipId} ${statusId}`}
      />
      {status === 'success' && (
        <StatusMessage status="success" id={statusId}>
          <span>{success}</span>
        </StatusMessage>
      )}
      {status === 'warning' && (
        <StatusMessage status="warning" id={statusId}>
          <span>{warning}</span>
        </StatusMessage>
      )}
      {status === 'error' && (
        <StatusMessage status="error" id={statusId}>
          <span>{error}</span>
        </StatusMessage>
      )}
    </FieldWrapper>
  )
}

export const SelectField = styled(SelectFieldBase)`
  position: relative;
  ${margin}
  ${width}

  ${Label} {
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 28px;
  }

  ${Tooltip}  {
    position: absolute;
    right: 8px
    top: 2px;
    font-size: 16px;
  }

  ${Select} {
    width: 100%;
  }

  ${StatusMessage} {
    margin-left: 16px;
    margin-top: 4px;
  }
`

// @ts-ignore
SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  name: PropTypes.string.isRequired,
  // @ts-ignore
  options: Select.propTypes.options,
  className: PropTypes.string,
  id: PropTypes.string,
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  onChange: PropTypes.func,
}

export default SelectField
