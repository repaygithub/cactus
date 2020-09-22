import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { FieldProps, useAccessibleField } from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import CheckBoxField, { CheckBoxFieldProps } from '../CheckBoxField/CheckBoxField'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import handleEvent from '../helpers/eventHandler'
import { cloneAll } from '../helpers/react'
import { border } from '../helpers/theme'
import Label from '../Label/Label'
import StatusMessage from '../StatusMessage/StatusMessage'
import Tooltip from '../Tooltip/Tooltip'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler } from '../types'

interface CheckBoxGroupProps
  extends MarginProps,
    WidthProps,
    Omit<FieldProps, 'labelProps'>,
    Omit<
      React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
      'name' | 'onChange' | 'onFocus' | 'onBlur' | 'defaultValue'
    > {
  value?: { [K: string]: boolean }
  defaultValue?: { [K: string]: boolean }
  required?: boolean
  onChange?: FieldOnChangeHandler<boolean>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
}

type CheckBoxGroupItemProps = Omit<CheckBoxFieldProps, 'required'>
const CheckBoxGroupItem = React.forwardRef<HTMLInputElement, CheckBoxGroupItemProps>(
  (props: any, ref) => <CheckBoxField ref={ref} {...props} />
)
CheckBoxGroupItem.displayName = 'CheckBoxGroup.Item'

type ForwardProps = {
  disabled?: boolean
  required?: boolean
}

export const CheckBoxGroup = React.forwardRef<HTMLFieldSetElement, CheckBoxGroupProps>(
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

    const forwardProps: ForwardProps = { required }
    if (disabled === true) {
      forwardProps.disabled = disabled
    }

    const cloneWithValue = (element: React.ReactElement, props: any) => {
      if (value !== undefined) {
        props = { ...props, checked: value[element.props.name] || false }
        // if (element.props.value !== undefined) {
        //   props = { ...props, checked: element.props.value === value }
        // } else {
        //   props = { ...props, value }
        // }
      } else if (defaultValue !== undefined) {
        props = { ...props, defaultChecked: defaultValue[element.props.name] || false }
        // if (element.props.value !== undefined) {
        //   props = { ...props, defaultChecked: element.props.value === defaultValue }
        // } else {
        //   props = { ...props, defaultValue }
        // }
      }
      return React.cloneElement(element, props)
    }
    children = cloneAll(children, forwardProps, cloneWithValue)

    const handleChange = React.useCallback(
      (event: React.FormEvent<HTMLFieldSetElement>): void => {
        if (typeof onChange === 'function') {
          const target = (event.target as unknown) as HTMLInputElement
          onChange(target.name, target.checked)
        }
      },
      [onChange]
    )

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLFieldSetElement>): void => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          handleEvent(onFocus, name)
          setTooltipVisible(() => true)
        }
      },
      [name, onFocus]
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
      <FieldSet
        {...props}
        ref={ref}
        id={fieldId}
        aria-describedby={ariaDescribedBy}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <Label id={labelId} as="legend">
          {label}
        </Label>
        <Box mx={4} pt={3}>
          {children}
        </Box>
        {tooltip && (
          <Tooltip
            id={tooltipId}
            label={tooltip}
            disabled={disabled}
            forceVisible={autoTooltip ? showTooltip : false}
          />
        )}
        {status && (
          <div>
            <StatusMessage status={status} id={statusId}>
              {statusMessage}
            </StatusMessage>
          </div>
        )}
      </FieldSet>
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
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.objectOf(PropTypes.bool.isRequired),
  defaultValue: PropTypes.objectOf(PropTypes.bool.isRequired),
}

type CheckBoxGroupType = typeof CheckBoxGroup & { Item: typeof CheckBoxGroupItem }

const DefaultCheckBoxGroup = CheckBoxGroup as any
DefaultCheckBoxGroup.Item = CheckBoxGroupItem

export default DefaultCheckBoxGroup as CheckBoxGroupType

const FieldSet = styled(FieldWrapper)<{ disabled?: boolean }>`
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
