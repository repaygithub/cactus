import { FieldWrapper } from '../FieldWrapper/FieldWrapper'
import { Label } from '../Label/Label'
import { margin, MarginProps, width, WidthProps } from 'styled-system'
import { Tooltip } from '../Tooltip/Tooltip'
import PropTypes from 'prop-types'
import React from 'react'
import StatusMessage, { Status } from '../StatusMessage/StatusMessage'
import styled from 'styled-components'
import useId from '../helpers/useId'

interface AccessibleProps {
  name: string
  fieldId: string
  ariaDescribedBy: string
  labelId: string
  tooltipId: string
  statusId: string
  status?: Status
  statusMessage?: string
}

type RenderFunc = (props: AccessibleProps) => JSX.Element | JSX.Element[]

interface AccessibleFieldProps extends MarginProps, WidthProps {
  id?: string
  name: string
  label: React.ReactNode
  labelProps?: Omit<React.ComponentPropsWithoutRef<typeof Label>, 'children'>
  tooltip?: string
  error?: string
  warning?: string
  success?: string
  className?: string
  children: JSX.Element | RenderFunc
}

export interface ExtAccessibleFieldProps extends Omit<AccessibleFieldProps, 'children'> { }

export function useAccessibleField({
  id,
  name,
  error,
  warning,
  success,
}: Partial<AccessibleFieldProps>): AccessibleProps {
  const fieldId = useId(id, name)
  const labelId = `${fieldId}-label`
  const statusId = `${fieldId}-status`
  const tooltipId = `${fieldId}-tip`

  let status: Status | undefined
  let statusMessage: string | undefined
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

  return {
    fieldId,
    ariaDescribedBy: `${tooltipId} ${statusId}`,
    labelId,
    statusId,
    name: name || '',
    status,
    statusMessage,
    tooltipId,
  }
}

function AccessibleFieldBase(props: AccessibleFieldProps) {
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
  } = accessibility

  const ref = React.useRef<HTMLDivElement | null>(null)
  const [maxWidth, setMaxWidth] = React.useState<string | undefined>(undefined)
  React.useLayoutEffect(() => {
    if (ref.current instanceof HTMLElement) {
      const containerWidth = `${ref.current.getBoundingClientRect().width - 32}px`
      if (containerWidth !== maxWidth) {
        setMaxWidth(containerWidth)
      }
    }
  }, [maxWidth, setMaxWidth])

  return (
    <FieldWrapper className={props.className} ref={ref}>
      <Label {...props.labelProps} id={labelId} htmlFor={fieldId}>
        {props.label}
      </Label>
      {props.tooltip && <Tooltip label={props.tooltip} id={tooltipId} maxWidth={maxWidth} />}
      {typeof props.children === 'function'
        ? props.children(accessibility)
        : React.cloneElement(React.Children.only(props.children), {
          id: fieldId,
          name,
          'aria-describedby': ariaDescribedBy,
          status,
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

  ${Label} {
    display: block;
    box-sizing: border-box;
    padding-left: 16px;
    padding-right: 28px;
  }

  ${Tooltip}  {
    position: absolute;
    right: 8px
    top: 2px;
    font-size: 16px;
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
  success: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  tooltip: PropTypes.string,
}

export default AccessibleField
