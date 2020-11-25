import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { MarginProps, WidthProps } from 'styled-system'

import { FieldProps, useAccessibleField } from '../AccessibleField/AccessibleField'
import { TooltipAlignment } from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import Fieldset from '../Fieldset/Fieldset'
import Flex from '../Flex/Flex'
import handleEvent from '../helpers/eventHandler'
import { cloneAll } from '../helpers/react'
import Label from '../Label/Label'
import RadioButtonField, { RadioButtonFieldProps } from '../RadioButtonField/RadioButtonField'
import StatusMessage from '../StatusMessage/StatusMessage'
import Tooltip from '../Tooltip/Tooltip'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler } from '../types'

interface RadioGroupProps
  extends MarginProps,
    WidthProps,
    Omit<FieldProps, 'labelProps'>,
    Omit<
      React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
      'name' | 'onChange' | 'onFocus' | 'onBlur'
    > {
  value?: string | number
  defaultValue?: string | number
  required?: boolean
  onChange?: FieldOnChangeHandler<string>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
}
interface LabelWrapper {
  alignTooltip?: TooltipAlignment
}

// This allows omitting the required `name` prop, since it'll be injected by the RadioGroup.
type RadioGroupButtonProps = Omit<RadioButtonFieldProps, 'name' | 'required'>
const RadioGroupButton = React.forwardRef<HTMLInputElement, RadioGroupButtonProps>(
  (props: any, ref) => <RadioButtonField ref={ref} {...props} />
)
RadioGroupButton.displayName = 'RadioGroup.Button'

type ForwardProps = {
  name: string
  disabled?: boolean
  required?: boolean
}

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      children,
      tooltip,
      required,
      defaultValue,
      value,
      onChange,
      onFocus,
      onBlur,
      autoTooltip = true,
      disableTooltip,
      alignTooltip = 'right',
      ...props
    },
    ref
  ) => {
    const {
      fieldId,
      ariaDescribedBy,
      labelId,
      statusId,
      name,
      status,
      statusMessage,
      tooltipId,
      disabled,
    } = useAccessibleField(props)
    const [showTooltip, setTooltipVisible] = React.useState<boolean>(false)

    const forwardProps: ForwardProps = { name, required }
    if (disabled === true) {
      forwardProps.disabled = disabled
    }
    const cloneWithValue = (element: React.ReactElement, props: any) => {
      if (value !== undefined) {
        if (element.props.value !== undefined) {
          props = { ...props, checked: element.props.value === value }
        } else {
          props = { ...props, value }
        }
      } else if (defaultValue !== undefined) {
        if (element.props.value !== undefined) {
          props = { ...props, defaultChecked: element.props.value === defaultValue }
        } else {
          props = { ...props, defaultValue }
        }
      }
      return React.cloneElement(element, props)
    }
    children = cloneAll(children, forwardProps, cloneWithValue)

    const handleChange = React.useCallback(
      (event: React.FormEvent<HTMLFieldSetElement>): void => {
        if (typeof onChange === 'function') {
          const target = (event.target as unknown) as HTMLInputElement
          onChange(name, target.value)
        }
      },
      [name, onChange]
    )
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLFieldSetElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          handleEvent(onFocus, name)
          setTooltipVisible(() => true)
        }
      },
      [onFocus, name, setTooltipVisible]
    )
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLFieldSetElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          handleEvent(onBlur, name)
          setTooltipVisible(() => false)
        }
      },
      [onBlur, name, setTooltipVisible]
    )

    return (
      <Fieldset
        {...props}
        ref={ref}
        id={fieldId}
        role="radiogroup"
        aria-describedby={ariaDescribedBy}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <LabelWrapper
          alignTooltip={alignTooltip}
          justifyContent={alignTooltip === 'right' ? 'space-between' : 'flex-start'}
        >
          <Label id={labelId} as="legend">
            {label}
          </Label>
          {tooltip && (
            <Tooltip
              id={tooltipId}
              label={tooltip}
              disabled={disableTooltip ?? disabled}
              forceVisible={autoTooltip ? showTooltip : false}
            />
          )}
        </LabelWrapper>

        <Box mx={4} pt={3}>
          {children}
        </Box>
        {status && (
          <div>
            <StatusMessage status={status} id={statusId}>
              {statusMessage}
            </StatusMessage>
          </div>
        )}
      </Fieldset>
    )
  }
)

const LabelWrapper = styled(Flex)<LabelWrapper>`
  flex-wrap: nowrap;
  border-bottom: 1px solid currentColor;
  ${Tooltip} {
    position: relative;
    right: 0;
    bottom: 0;
  }
  ${Label} {
    border: 0;
    width: auto;
    display: block;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: ${(p) => (p.alignTooltip === 'right' ? '28px' : '5px')};
    padding-right: ${(p) => (p.alignTooltip === 'right' ? '28px' : '5px')};
  }
`

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
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: function (props: Record<string, any>): Error | null {
    if (props.value !== undefined) {
      const proptype = typeof props.value
      if (!(proptype === 'string' || proptype === 'number')) {
        return new Error('The `value` prop must be a string or number.')
      }
    }
    return null
  },
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
