import PropTypes from 'prop-types'
import React from 'react'
import { MarginProps, WidthProps } from 'styled-system'

import { FieldProps } from '../AccessibleField/AccessibleField'
import CheckBoxField, { CheckBoxFieldProps } from '../CheckBoxField/CheckBoxField'
import Fieldset from '../Fieldset/Fieldset'
interface CheckBoxGroupProps
  extends MarginProps,
    WidthProps,
    Omit<FieldProps, 'labelProps'>,
    Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'name' | 'defaultValue'> {
  checked?: { [K: string]: boolean }
  required?: boolean
}

type CheckBoxGroupItemProps = Omit<CheckBoxFieldProps, 'required'>
const CheckBoxGroupItem = React.forwardRef<HTMLInputElement, CheckBoxGroupItemProps>(
  (props: any, ref) => <CheckBoxField ref={ref} {...props} />
)
CheckBoxGroupItem.displayName = 'CheckBoxGroup.Item'

const noop = () => undefined

export const CheckBoxGroup = React.forwardRef<HTMLFieldSetElement, CheckBoxGroupProps>(
  ({ children, checked, ...props }, ref) => {
    const hasOnChange = !!props.onChange
    const cloneWithValue = (element: React.ReactElement, cloneProps: any) => {
      if (checked !== undefined) {
        cloneProps = { ...cloneProps, checked: checked[element.props.name] || false }
      }
      // This is to avert a PropTypes warning regarding missing onChange handler.
      const hasChecked = cloneProps.checked !== undefined || element.props.checked !== undefined
      if (hasChecked && hasOnChange && !element.props.onChange) {
        cloneProps = { ...cloneProps, onChange: noop }
      }
      return React.cloneElement(element, cloneProps)
    }

    return (
      <Fieldset {...props} forwardProps={['required']} cloneWithValue={cloneWithValue} ref={ref}>
        {children}
      </Fieldset>
    )
  }
)

CheckBoxGroup.displayName = 'CheckBoxGroup'

CheckBoxGroup.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  checked: PropTypes.objectOf(PropTypes.bool.isRequired),
}

type CheckBoxGroupType = typeof CheckBoxGroup & { Item: typeof CheckBoxGroupItem }

const DefaultCheckBoxGroup = CheckBoxGroup as any
DefaultCheckBoxGroup.Item = CheckBoxGroupItem

export default DefaultCheckBoxGroup as CheckBoxGroupType
