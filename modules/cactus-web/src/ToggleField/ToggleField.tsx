import PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import Toggle, { ToggleProps } from '../Toggle/Toggle'
import { FieldOnChangeHandler } from '../types'

export interface ToggleFieldProps extends MarginProps, Omit<ToggleProps, 'id' | 'onChange'> {
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
}

const ToggleFieldBase = (props: ToggleFieldProps): React.ReactElement => {
  const {
    labelProps,
    className,
    label,
    id,
    name,
    onChange,
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

  return (
    <FieldWrapper className={className}>
      <Toggle {...toggleProps} disabled={disabled} name={name} id={fieldId} onClick={handleClick} />
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

ToggleField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
}

ToggleField.defaultProps = {
  value: false,
}

export default ToggleField
