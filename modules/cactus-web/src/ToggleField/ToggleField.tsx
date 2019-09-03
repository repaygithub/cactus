import * as React from 'react'

import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { margin, MarginProps } from 'styled-system'
import { omitMargins } from '../helpers/omit'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
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
  onChange?: FieldOnChangeHandler<boolean>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
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
  } = omitMargins(props) as Omit<ToggleFieldProps, keyof MarginProps>
  const fieldId = useId(id, name)

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

  const handleFocus = (event: React.FocusEvent) => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (event: React.FocusEvent) => {
    handleEvent(onBlur, name)
  }

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
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </FieldWrapper>
  )
}

export const ToggleField = styled(ToggleFieldBase)`
  ${margin}

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
