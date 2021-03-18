import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import {
  FieldProps,
  TooltipAlignment,
  useAccessibleField,
} from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { cloneAll, CloneFunc } from '../helpers/react'
import { border } from '../helpers/theme'
import Label from '../Label/Label'
import StatusMessage from '../StatusMessage/StatusMessage'
import Tooltip from '../Tooltip/Tooltip'

interface LabelWrapperProps {
  alignTooltip?: TooltipAlignment
}

type ForwardProp =
  | keyof Omit<FieldProps, 'labelProps'>
  | keyof Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'name' | 'defaultValue'>
  | 'required'

interface FieldsetProps
  extends MarginProps,
    WidthProps,
    Omit<FieldProps, 'labelProps'>,
    Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'name' | 'defaultValue'> {
  cloneWithValue: CloneFunc
  forwardProps: ForwardProp[]
  required?: boolean
}

// The `legend` is floated to get it to position the border correctly.
const StyledFieldset = styled(FieldWrapper)<{ disabled?: boolean }>`
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

export default React.forwardRef<HTMLFieldSetElement, FieldsetProps>((props, ref) => {
  const {
    alignTooltip,
    autoTooltip,
    children,
    cloneWithValue,
    disableTooltip,
    forwardProps,
    label,
    onBlur,
    onFocus,
    required,
    tooltip,
    ...otherProps
  } = props
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
  } = useAccessibleField({ ...otherProps, tooltip })

  const [showTooltip, setTooltipVisible] = React.useState<boolean>(false)

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLFieldSetElement>) => {
      onBlur?.(e)
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setTooltipVisible(() => false)
      }
    },
    [onBlur, setTooltipVisible]
  )

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLFieldSetElement>) => {
      onFocus?.(e)
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setTooltipVisible(() => true)
      }
    },
    [onFocus, setTooltipVisible]
  )

  const forwardPropsWithVals = forwardProps.reduce<Record<string, any>>(
    (propsObj, propToForward) => ({ ...propsObj, [propToForward]: props[propToForward] }),
    {}
  )
  if (disabled) {
    forwardPropsWithVals.disabled = true
  }

  const clonedChildren = cloneAll(children, forwardPropsWithVals, cloneWithValue)

  return (
    <StyledFieldset
      {...otherProps}
      ref={ref}
      id={fieldId}
      aria-describedby={ariaDescribedBy}
      name={name}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Label id={labelId} as="legend">
        <LabelWrapper alignTooltip={alignTooltip}>
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
      </Label>
      <Box mx={4} pt={3}>
        {clonedChildren}
      </Box>
      {status && (
        <div>
          <StatusMessage status={status} id={statusId}>
            {statusMessage}
          </StatusMessage>
        </div>
      )}
    </StyledFieldset>
  )
})

const LabelWrapper = styled.span<LabelWrapperProps>`
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
