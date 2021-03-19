import PropTypes from 'prop-types'
import React from 'react'
import { MarginProps, WidthProps } from 'styled-system'

import { FieldProps } from '../AccessibleField/AccessibleField'
import Fieldset from '../Fieldset/Fieldset'
import RadioButtonField, { RadioButtonFieldProps } from '../RadioButtonField/RadioButtonField'

interface RadioGroupProps
  extends MarginProps,
    WidthProps,
    Omit<FieldProps, 'labelProps'>,
    Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'name'> {
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

const noop = () => undefined

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ children, defaultValue, value, ...props }, ref) => {
    const hasOnChange = !!props.onChange
    const cloneWithValue = (element: React.ReactElement, cloneProps: any) => {
      if (value !== undefined) {
        if (element.props.value !== undefined) {
          cloneProps = { ...cloneProps, checked: element.props.value === value }
        } else {
          cloneProps = { ...cloneProps, value }
        }
      } else if (defaultValue !== undefined) {
        if (element.props.value !== undefined) {
          cloneProps = { ...cloneProps, defaultChecked: element.props.value === defaultValue }
        } else {
          cloneProps = { ...cloneProps, defaultValue }
        }
      }
      // This is to avert a PropTypes warning regarding missing onChange handler.
      const hasChecked = cloneProps.checked !== undefined || element.props.checked !== undefined
      if (hasChecked && hasOnChange && !element.props.onChange) {
        cloneProps = { ...cloneProps, onChange: noop }
      }
      return React.cloneElement(element, cloneProps)
    }

    return (
      <Fieldset
        {...props}
        ref={ref}
        role="radiogroup"
        forwardProps={['name', 'required']}
        cloneWithValue={cloneWithValue}
      >
        {children}
      </Fieldset>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'
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

type RadioGroupType = typeof RadioGroup & { Button: typeof RadioGroupButton }

const DefaultRadioGroup = RadioGroup as any
DefaultRadioGroup.Button = RadioGroupButton

export default DefaultRadioGroup as RadioGroupType
