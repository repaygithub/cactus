import PropTypes from 'prop-types'
import React from 'react'

import { ExtFieldProps } from '../AccessibleField/AccessibleField'
import { Fieldset, makeGroup } from '../Checkable/Group'
import RadioButtonField, { RadioButtonFieldProps } from '../RadioButtonField/RadioButtonField'

interface RadioGroupProps extends Omit<ExtFieldProps, 'role'> {
  children?: React.ReactNode
  value?: string | number
  defaultValue?: string | number
  required?: boolean
}

// This allows omitting the required `name` prop, since it'll be injected by the RadioGroup.
type RadioGroupButtonProps = Omit<RadioButtonFieldProps, 'name' | 'required'>
const RadioGroupButton = React.forwardRef<HTMLInputElement, RadioGroupButtonProps>(
  (props: any, ref) => <RadioButtonField ref={ref} {...props} />
)
RadioGroupButton.displayName = 'RadioGroup.Button'

// This is a restriction of the allowable props in CheckableGroup.
interface RadioGroupType extends React.FC<RadioGroupProps> {
  Button: typeof RadioGroupButton
}

export const RadioGroup = makeGroup({
  component: Fieldset,
  displayName: 'RadioGroup',
  role: 'radiogroup',
}) as RadioGroupType
RadioGroup.Button = RadioGroupButton

RadioGroup.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.node.isRequired,
  tooltip: PropTypes.node,
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: function (props: Record<string, any>): Error | null {
    if (props.defaultValue !== undefined) {
      const proptype = typeof props.defaultValue
      if (props.value !== undefined) {
        return new Error(
          'You provided both `value` and `defaultValue` props. Radio groups must be either controlled or uncontrolled (specify either the `value` prop, or the `defaultValue` prop, but not both). More info: https://fb.me/react-controlled-components'
        )
      } else if (!(proptype === 'string' || proptype === 'number')) {
        return new Error('The `defaultValue` prop must be a string or number.')
      }
    }
    return null
  },
}

export default RadioGroup
