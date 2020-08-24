import PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import Toggle, { ToggleProps } from '../Toggle/Toggle'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'

export interface ToggleFieldProps
  extends MarginProps,
    Omit<ToggleProps, 'id' | 'onChange' | 'onFocus' | 'onBlur'> {
  label: React.ReactNode
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

const ToggleFieldBase = (props: ToggleFieldProps): React.ReactElement => {
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
    disabled,
    ...toggleProps
  } = omitMargins(props) as Omit<ToggleFieldProps, keyof MarginProps>
  const fieldId = useId(id, name)

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>): void => {
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

  const handleFocus = (): void => {
    handleEvent(onFocus, name)
  }

  const handleBlur = (): void => {
    handleEvent(onBlur, name)
  }

  return (
    <FieldWrapper className={className}>
      <Toggle
        {...toggleProps}
        disabled={disabled}
        name={name}
        id={fieldId}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Label {...props.labelProps} htmlFor={fieldId}>
        {props.label}
      </Label>
    </FieldWrapper>
  )
}

export const ToggleField = styled(ToggleFieldBase)`
  ${margin}

  ${Label} {
    cursor: ${(p): string => (p.disabled ? 'not-allowed' : 'pointer')};
    margin-left: 8px;
    line-height: 26px;
    vertical-align: -2px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }

  ${Toggle} {
    vertical-align: middle;
  }
`

// @ts-ignore
ToggleField.propTypes = {
  label: PropTypes.node.isRequired,
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
