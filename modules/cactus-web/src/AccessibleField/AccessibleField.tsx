import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import { Flex } from '../Flex/Flex'
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

type RenderFunc = (props: AccessibleProps) => JSX.Element | JSX.Element[]

// These are the props commonly used by components that wrap AccessibleField.
export interface FieldProps {
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

interface AccessibleFieldProps extends FieldProps, MarginProps, WidthProps {
  id?: string
  className?: string
  children: JSX.Element | RenderFunc
  disabled?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExtAccessibleFieldProps extends Omit<AccessibleFieldProps, 'children'> {}

export function useAccessibleField({
  id,
  name,
  error,
  warning,
  success,
  disabled,
  tooltip,
}: Partial<AccessibleFieldProps>): AccessibleProps {
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

function AccessibleFieldBase(props: AccessibleFieldProps): React.ReactElement {
  const accessibility = useAccessibleField(props)
  const {
    fieldId,
    ariaDescribedBy,
    labelId,
    name,
    statusId,
    tooltipId,
    status,
    statusMessage,
    disabled,
  } = accessibility
  const { autoTooltip = true, disableTooltip, alignTooltip = 'right' } = props

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

  const handleFieldFocus = () => {
    if (autoTooltip) {
      setTooltipVisible(true)
    }
  }
  const handleFieldBlur = () => {
    if (autoTooltip) {
      setTooltipVisible(false)
    }
  }

  return (
    <FieldWrapper
      className={props.className}
      ref={ref}
      onFocus={handleFieldFocus}
      onBlur={handleFieldBlur}
    >
      <Flex
        justifyContent={alignTooltip === 'right' ? 'space-between' : 'flex-start'}
        alignItems="center"
      >
        <Label {...props.labelProps} id={labelId} htmlFor={fieldId}>
          {props.label}
        </Label>
        {props.tooltip && (
          <Tooltip
            label={props.tooltip}
            id={tooltipId}
            maxWidth={maxWidth}
            disabled={disableTooltip ?? disabled}
            forceVisible={!props.isOpen && forceTooltipVisible}
          />
        )}
      </Flex>
      {typeof props.children === 'function'
        ? props.children(accessibility)
        : React.cloneElement(React.Children.only(props.children), {
            id: fieldId,
            name,
            'aria-describedby': ariaDescribedBy,
            status,
            disabled,
          })}
      {status !== undefined && (
        <div>
          <StatusMessage status={status} id={statusId}>
            {statusMessage}
          </StatusMessage>
        </div>
      )}
    </FieldWrapper>
  )
}

export const AccessibleField = styled(AccessibleFieldBase)`
  position: relative;
  ${margin}
  ${width}
  display: flex;
  flex-direction: column;

  ${Label} {
    display: block;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 8px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }

  ${Tooltip} {
    position: relative;
    font-size: 16px;
    padding-right: 8px;
  }

  ${StatusMessage} {
    margin-top: 4px;
  }
`

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
