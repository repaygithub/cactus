import * as React from 'react'

import { FieldEventHandler, Omit } from '../types'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import Label, { LabelProps } from '../Label/Label'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Toggle, { ToggleProps } from '../Toggle/Toggle'
import useId from '../helpers/useId'

export interface ToggleFieldProps
  extends MarginProps,
    Omit<ToggleProps, 'id' | 'onChange' | 'onFocus' | 'onBlur'> {
  label: string
  /** props to be passed to the Label element (available for accessibility considerations) */
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  /** required for form state management */
  name: string
  value?: boolean
  /** !important */
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange?: FieldEventHandler<boolean>
  onFocus?: FieldEventHandler<boolean>
  onBlur?: FieldEventHandler<boolean>
}

const ToggleFieldBase = (props: ToggleFieldProps) => {
  const {
    labelProps,
    className,
    label,
    id,
    name,
    onChange,
    onFocus,
    onBlur,
    onClick,
    ...toggleProps
  } = splitProps(props)
  const fieldId = useId(id, name)

  const handleEvent = (handler?: FieldEventHandler<boolean>) => {
    return (event: React.FormEvent<HTMLButtonElement>) => {
      if (typeof handler === 'function') {
        const target = (event.target as unknown) as HTMLButtonElement
        handler(name, target.getAttribute('aria-checked') === 'true')
      }
    }
  }

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (typeof onClick === 'function') {
        onClick(event)
      }
      if (typeof onChange === 'function') {
        const currentTarget = (event.currentTarget as unknown) as HTMLButtonElement
        onChange(name, currentTarget.getAttribute('aria-checked') !== 'true')
      }
    },
    [onClick, onChange, name]
  )

  return (
    <FieldWrapper className={className}>
      <Label {...props.labelProps} htmlFor={fieldId}>
        {props.label}
      </Label>
      <Toggle
        {...toggleProps}
        name={name}
        id={fieldId}
        onClick={handleClick}
        onFocus={handleEvent(onFocus)}
        onBlur={handleEvent(onBlur)}
      />
    </FieldWrapper>
  )
}

export const ToggleField = styled(ToggleFieldBase)`
  ${margins}

  ${Label} {
    cursor: pointer;
    margin-right: 8px;
  }

  ${Toggle} {
    vertical-align: text-bottom;
  }
`

// @ts-ignore
ToggleField.propTypes = {
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

ToggleField.defaultProps = {
  value: false,
}

export default ToggleField
