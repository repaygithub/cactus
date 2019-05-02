import * as React from 'react'
import { Omit, FieldOnChangeHandler } from '../types'
import styled from 'styled-components'
import { margins, MarginProps } from '../helpers/margins'
import Label, { LabelProps } from '../Label/Label'
import Toggle, { ToggleProps } from '../Toggle/Toggle'
import useId from '../helpers/useId'

interface ToggleFieldProps extends MarginProps, Omit<ToggleProps, 'id' | 'onChange'> {
  label: string
  /** props to be passed to the Label element (available for accessibility considerations) */
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  /** required for form state management */
  name: string
  value: boolean
  /** !important */
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange?: FieldOnChangeHandler<boolean>
}

const ToggleFieldBase = (props: ToggleFieldProps) => {
  const { labelProps, className, label, id, name, onChange, onClick, ...toggleProps } = props
  const fieldId = useId(id, name)
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (typeof onClick === 'function') {
        onClick(event)
      }
      if (typeof onChange === 'function') {
        const target = (event.target as unknown) as HTMLButtonElement
        onChange(name, target.getAttribute('aria-checked') !== 'true')
      }
    },
    [onClick, onChange, name]
  )
  return (
    <div className={className}>
      <Label {...props.labelProps} htmlFor={fieldId}>
        {props.label}
      </Label>
      <Toggle {...toggleProps} name={name} id={fieldId} onClick={handleClick} />
    </div>
  )
}

export const ToggleField = styled(ToggleFieldBase)`
  ${margins}

  ${Label} {
    margin-right: 8px;
  }

  ${Toggle} {
    vertical-align: text-bottom;
  }
`

export default ToggleField
