import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps, width, WidthProps } from 'styled-system'

import {
  AccessibleField,
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

const StyledFieldset = styled(AccessibleField)<{ disabled?: boolean }>`
  .field-label-row {
    border-bottom: ${(p) => border(p.theme, p.disabled ? 'mediumGray' : 'currentcolor')};
  }
`

export default React.forwardRef<HTMLFieldSetElement, FieldsetProps>((props, ref) => {
  const {
    children,
    cloneWithValue,
    forwardProps,
    required,
    ...otherProps
  } = props

  const forwardPropsWithVals = forwardProps.reduce<Record<string, any>>(
    (propsObj, propToForward) => ({ ...propsObj, [propToForward]: props[propToForward] }),
    {}
  )
  if (props.disabled) {
    forwardPropsWithVals.disabled = true
  }

  const clonedChildren = cloneAll(children, forwardPropsWithVals, cloneWithValue)

  return (
    <StyledFieldset
      {...otherProps}
      ref={ref}
    >
      {() => (
        <Box mx={4} pt={3}>
          {clonedChildren}
        </Box>
      )}
    </StyledFieldset>
  )
})
