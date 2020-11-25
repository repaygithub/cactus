import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { MarginProps, WidthProps } from 'styled-system'

import { FieldProps, useAccessibleField } from '../AccessibleField/AccessibleField'
import { TooltipAlignment } from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import CheckBoxField, { CheckBoxFieldProps } from '../CheckBoxField/CheckBoxField'
import Fieldset from '../Fieldset/Fieldset'
import Flex from '../Flex/Flex'
import handleEvent from '../helpers/eventHandler'
import { cloneAll } from '../helpers/react'
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
  checked?: { [K: string]: boolean }
  required?: boolean
  onChange?: FieldOnChangeHandler<boolean>
  onFocus?: FieldOnFocusHandler
  onBlur?: FieldOnBlurHandler
  disableTooltip?: boolean
}

interface LabelWrapper {
  alignTooltip?: TooltipAlignment
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
      checked,
      onChange,
      onFocus,
      onBlur,
      disableTooltip,
      autoTooltip = true,
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

    const forwardProps: ForwardProps = { required }
    if (disabled === true) {
      forwardProps.disabled = disabled
    }

    const cloneWithValue = (element: React.ReactElement, props: any) => {
      if (checked !== undefined) {
        props = { ...props, checked: checked[element.props.name] || false }
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
      <Fieldset
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
  checked: PropTypes.objectOf(PropTypes.bool.isRequired),
}

type CheckBoxGroupType = typeof CheckBoxGroup & { Item: typeof CheckBoxGroupItem }

const DefaultCheckBoxGroup = CheckBoxGroup as any
DefaultCheckBoxGroup.Item = CheckBoxGroupItem

export default DefaultCheckBoxGroup as CheckBoxGroupType
