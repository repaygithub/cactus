import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { FieldProps, useAccessibleField } from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
import { cloneAll, useMergedRefs } from '../helpers/react'
import { border } from '../helpers/theme'
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

const useValue = (
  fsRef: React.RefObject<HTMLFieldSetElement>,
  attr: 'checked' | 'defaultChecked',
  value: string | number | undefined,
  dependencies: any[] = []
) => {
  React.useEffect(() => {
    if (value !== undefined && fsRef.current instanceof HTMLFieldSetElement) {
      const radios = fsRef.current.querySelectorAll('input[type="radio"]')
      for (let i = 0; i < radios.length; i++) {
        const radio = radios[i] as HTMLInputElement
        if (radio.value == value) {
          radio[attr] = true
        }
      }
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
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

    const fsRef = React.useRef<HTMLFieldSetElement>(null)
    const mergedRef = useMergedRefs(ref, fsRef)
    useValue(fsRef, 'defaultChecked', defaultValue)
    useValue(fsRef, 'checked', value, [value])

    const forwardProps: ForwardProps = { name, required }
    if (disabled === true) {
      forwardProps.disabled = disabled
    }
    children = cloneAll(children, forwardProps)

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
        ref={mergedRef}
        id={fieldId}
        role="radiogroup"
        aria-describedby={ariaDescribedBy}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <Label as="legend" id={labelId}>
          {label}
        </Label>
        <Box mx={4} pt={3}>
          {children}
        </Box>
        {tooltip && (
          <Tooltip id={tooltipId} label={tooltip} disabled={disabled} forceVisible={showTooltip} />
        )}
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

// The `legend` is floated to get it to position the border correctly.
const Fieldset = styled(FieldWrapper)<{ disabled?: boolean }>`
  position: relative;
  border: 0;
  margin: 0;
  padding: 0;
  ${margin}
  ${width}

  legend {
    box-sizing: border-box;
    border-bottom: ${(p) => border(p.theme, 'currentcolor')};
    padding-left: 16px;
    padding-right: 28px;
    width: 100%;
    float: left;
    + * {
      clear: both;
    }
    color: ${(p) => (p.disabled ? p.theme.colors.mediumGray : 'currentcolor')};
  }

  ${Tooltip} {
    position: absolute;
    right: 8px;
    top: 2px;
    font-size: 16px;
  }

  ${StatusMessage} {
    margin-top: 4px;
  }
`.withComponent('fieldset')
