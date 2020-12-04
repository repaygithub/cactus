import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { MarginProps, WidthProps } from 'styled-system'

import { FieldProps, useAccessibleField } from '../AccessibleField/AccessibleField'
import { TooltipAlignment } from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import CheckBoxField, { CheckBoxFieldProps } from '../CheckBoxField/CheckBoxField'
import Fieldset from '../Fieldset/Fieldset'
import { cloneAll } from '../helpers/react'
import Label from '../Label/Label'
import StatusMessage from '../StatusMessage/StatusMessage'
import Tooltip from '../Tooltip/Tooltip'
interface CheckBoxGroupProps
  extends MarginProps,
    WidthProps,
    Omit<FieldProps, 'labelProps'>,
    Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'name' | 'defaultValue'> {
  checked?: { [K: string]: boolean }
  required?: boolean
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

const noop = () => undefined

export const CheckBoxGroup = React.forwardRef<HTMLFieldSetElement, CheckBoxGroupProps>(
  (
    {
      label,
      children,
      tooltip,
      required,
      checked,
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
    } = useAccessibleField({ ...props, tooltip })
    const [showTooltip, setTooltipVisible] = React.useState<boolean>(false)

    const forwardProps: ForwardProps = { required }
    if (disabled === true) {
      forwardProps.disabled = disabled
    }

    const hasOnChange = !!props.onChange
    const cloneWithValue = (element: React.ReactElement, props: any) => {
      if (checked !== undefined) {
        props = { ...props, checked: checked[element.props.name] || false }
      }
      // This is to avert a PropTypes warning regarding missing onChange handler.
      const hasChecked = props.checked !== undefined || element.props.checked !== undefined
      if (hasChecked && hasOnChange && !element.props.onChange) {
        props = { ...props, onChange: noop }
      }
      return React.cloneElement(element, props)
    }
    children = cloneAll(children, forwardProps, cloneWithValue)

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLFieldSetElement>): void => {
        onFocus?.(event)
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setTooltipVisible(() => true)
        }
      },
      [onFocus]
    )

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLFieldSetElement>) => {
        onBlur?.(e)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setTooltipVisible(() => false)
        }
      },
      [onBlur, setTooltipVisible]
    )

    return (
      <Fieldset
        {...props}
        ref={ref}
        id={fieldId}
        aria-describedby={ariaDescribedBy}
        name={name}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <LabelWrapper id={labelId} as="legend" alignTooltip={alignTooltip}>
          {label}
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

const LabelWrapper = styled(Label)<LabelWrapper>`
  flex-wrap: nowrap;
  display: flex;
  justify-content: ${(p) => (p.alignTooltip === 'right' ? 'space-between' : 'flex-start')};
  padding-right: 8px;
  ${Tooltip} {
    position: relative;
    right: 0;
    bottom: 0;
    padding-left: ${(p) => (p.alignTooltip === 'right' ? 0 : '8px')};
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
  checked: PropTypes.objectOf(PropTypes.bool.isRequired),
}

type CheckBoxGroupType = typeof CheckBoxGroup & { Item: typeof CheckBoxGroupItem }

const DefaultCheckBoxGroup = CheckBoxGroup as any
DefaultCheckBoxGroup.Item = CheckBoxGroupItem

export default DefaultCheckBoxGroup as CheckBoxGroupType
