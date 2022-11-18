import PropTypes from 'prop-types'
import React from 'react'

import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { withStyles } from '../helpers/styled'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'

export interface CheckBoxFieldProps extends CheckBoxProps {
  label: React.ReactNode
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  name?: string
  disabled?: boolean
}

const CheckBoxFieldBase = React.forwardRef<HTMLInputElement, CheckBoxFieldProps>((props, ref) => {
  const { label, labelProps, id, name, className, style, ...checkboxProps } = props
  const checkboxId = useId(id, name)

  return (
    <div className={className} style={style}>
      <CheckBox {...checkboxProps} ref={ref} id={checkboxId} name={name} />
      <Label {...labelProps} htmlFor={checkboxId}>
        {label}
      </Label>
    </div>
  )
})
CheckBoxFieldBase.displayName = 'CheckBoxField'

export const CheckBoxField = withStyles(FieldWrapper, { as: CheckBoxFieldBase })`
  ${Label} {
    cursor: ${(p): string => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }
`
CheckBoxField.defaultProps = { $gap: 3 }

CheckBoxField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
}

export default CheckBoxField
