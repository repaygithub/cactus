import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import { Flex } from '../Flex/Flex'
import { isFocusOut } from '../helpers/events'
import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { omitProps } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import { Tooltip } from '../Tooltip/Tooltip'

export type TooltipAlignment = 'left' | 'right'
interface AccessibleProps {
  name: string
  fieldId: string
  ariaDescribedBy?: string
  labelId: string
  tooltipId: string
  statusId: string
  status?: Status
  statusMessage?: React.ReactNode
  disabled?: boolean
  disableTooltip?: boolean
}

type RenderFunc = (props: AccessibleProps) => React.ReactNode

interface CommonProps {
  name: string
  label: React.ReactNode
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor' | 'id'>
  tooltip?: React.ReactNode
  error?: React.ReactNode
  warning?: React.ReactNode
  success?: React.ReactNode
  autoTooltip?: boolean
  isOpen?: boolean
  disableTooltip?: boolean
  alignTooltip?: TooltipAlignment
}

// These are the props commonly used by components that wrap AccessibleField.
export interface FieldProps extends CommonProps, FlexItemProps, MarginProps {}

interface InnerProps
  extends CommonProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'defaultChecked' | 'defaultValue'> {
  children: React.ReactElement | RenderFunc
  disabled?: boolean
}
interface AccessibleFieldProps extends InnerProps, FlexItemProps, MarginProps, WidthProps {}

interface AccessibleHookArgs {
  id?: string
  name?: string
  disabled?: boolean
  tooltip?: React.ReactNode
  error?: React.ReactNode
  warning?: React.ReactNode
  success?: React.ReactNode
}

export type ExtFieldProps = Omit<AccessibleFieldProps, 'children'>

export function useAccessibleField({
  id,
  name,
  error,
  warning,
  success,
  disabled,
  tooltip,
}: AccessibleHookArgs): AccessibleProps {
  const fieldId = useId(id, name)
  const labelId = `${fieldId}-label`
  const statusId = `${fieldId}-status`
  const tooltipId = `${fieldId}-tip`

  let status: Status | undefined
  let statusMessage: React.ReactNode | undefined
  if (error) {
    status = 'error'
    statusMessage = error
  } else if (warning) {
    status = 'warning'
    statusMessage = warning
  } else if (success) {
    status = 'success'
    statusMessage = success
  }

  const describedByIds = [tooltip && tooltipId, status && statusId].filter(Boolean)

  return {
    fieldId,
    ariaDescribedBy: describedByIds.join(' ') || undefined,
    labelId,
    statusId,
    name: name || '',
    status,
    statusMessage,
    tooltipId,
    disabled,
  }
}

function AccessibleFieldBase(props: InnerProps) {
  const {
    alignTooltip = 'right',
    autoTooltip = true,
    children,
    disableTooltip,
    disabled,
    error,
    id,
    isOpen,
    label,
    labelProps,
    name,
    success,
    tooltip,
    warning,
    onBlur,
    onFocus,
    ...rest
  } = props
  const hookArgs = { id, name, tooltip, disabled, error, warning, success }
  const accessibility = useAccessibleField(hookArgs)
  const { fieldId, ariaDescribedBy, labelId, statusId, tooltipId, status, statusMessage } =
    accessibility

  const ref = React.useRef<HTMLDivElement | null>(null)
  const [forceTooltipVisible, setTooltipVisible] = React.useState<boolean>(false)

  const [maxWidth, setMaxWidth] = React.useState<string | undefined>(undefined)
  React.useLayoutEffect((): void => {
    if (ref.current instanceof HTMLElement) {
      const containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
      if (containerWidth !== maxWidth) {
        setMaxWidth(containerWidth)
      }
    }
  }, [maxWidth, setMaxWidth])

  const handleFieldBlur = React.useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onBlur?.(e)
      if (autoTooltip && isFocusOut(e)) {
        setTooltipVisible(() => false)
      }
    },
    [onBlur, autoTooltip, setTooltipVisible]
  )

  const handleFieldFocus = React.useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onFocus?.(e)
      if (autoTooltip) {
        setTooltipVisible(() => true)
      }
    },
    [onFocus, autoTooltip, setTooltipVisible]
  )

  // If this represents a group of fields, the label points to the group instead of the child.
  if (rest.role?.includes('group')) {
    // @ts-ignore
    rest.id = fieldId
    rest['aria-labelledby'] = labelId
    rest['aria-describedby'] = ariaDescribedBy
  }

  return (
    <div {...rest} ref={ref} onFocus={handleFieldFocus} onBlur={handleFieldBlur}>
      <Flex
        className="field-label-row"
        flexWrap="nowrap"
        justifyContent={alignTooltip === 'right' ? 'space-between' : 'flex-start'}
        alignItems="center"
      >
        <Label {...labelProps} id={labelId} htmlFor={fieldId}>
          {label}
        </Label>
        {tooltip && (
          <Tooltip
            label={tooltip}
            id={tooltipId}
            maxWidth={maxWidth}
            disabled={disableTooltip ?? disabled}
            forceVisible={!isOpen && forceTooltipVisible}
          />
        )}
      </Flex>
      {typeof children === 'function'
        ? children(accessibility)
        : React.cloneElement(React.Children.only(children), {
            id: fieldId,
            name,
            'aria-describedby': ariaDescribedBy,
            status,
            disabled,
          })}
      {status !== undefined && (
        <div className="field-status-row">
          <StatusMessage status={status} id={statusId}>
            {statusMessage}
          </StatusMessage>
        </div>
      )}
    </div>
  )
}

export const AccessibleField = styled(FieldWrapper)
  .withConfig(omitProps<AccessibleFieldProps>(width, margin, flexItem))
  .attrs({ as: AccessibleFieldBase })`
  position: relative;
  ${width}
  display: flex;
  flex-direction: column;

  .field-label-row ${Label} {
    display: block;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 8px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }

  .field-label-row ${Tooltip} {
    position: relative;
    font-size: 16px;
    padding-right: 8px;
  }

  .field-status-row ${StatusMessage} {
    margin-top: 4px;
  }
` as React.FC<AccessibleFieldProps>

AccessibleField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  tooltip: PropTypes.node,
  disabled: PropTypes.bool,
  autoTooltip: PropTypes.bool,
  disableTooltip: PropTypes.bool,
}

export default AccessibleField
