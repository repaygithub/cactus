import { noop, pick } from 'lodash'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { ExtFieldProps } from '../AccessibleField/AccessibleField'
import Box from '../Box/Box'
import { isIE } from '../helpers/constants'
import { cloneAll } from '../helpers/react'
import { border } from '../helpers/theme'

const getCheckedFromValue = (value: Value, groupValue: GroupValue) =>
  Array.isArray(groupValue) ? groupValue.includes(value) : value === groupValue

type Value = string | number
type GroupValue = Value | Value[]

interface CheckableGroupProps {
  checked?: Record<string, any> // Using `any` to be more compatible with form libs.
  defaultChecked?: Record<string, boolean>
  value?: GroupValue
  defaultValue?: GroupValue
  name?: string
  required?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<any>
  children?: React.ReactNode
}

export type GroupProps = ExtFieldProps & CheckableGroupProps

type ConsumedProps = 'checked' | 'defaultChecked' | 'value' | 'defaultValue' | 'required'
// Neither checkbox nor radio support `defaultValue`, so we don't forward it normally.
const FORWARD = ['required', 'disabled', 'name', 'checked', 'value', 'defaultChecked']

export function useCheckableGroupProps<P extends CheckableGroupProps>(
  props: P
): Omit<P, ConsumedProps> {
  const hasOnChange = !!props.onChange
  const groupName = props.name
  const {
    checked: groupChecked,
    defaultChecked,
    value: groupValue,
    defaultValue,
    required,
    ...rest
  } = props
  const forwardProps = { required, disabled: rest.disabled, name: groupName }
  const cloneWithValue = (element: React.ReactElement, cloneProps: any) => {
    cloneProps = { ...cloneProps, ...pick(element.props, FORWARD) }
    const { name, value } = element.props
    // Forwards props in order of precedence: checked > value > defaultChecked > defaultValue
    if (cloneProps.checked === undefined) {
      if (groupChecked) {
        cloneProps.checked = name ? !!groupChecked[name] : groupChecked
      } else if (groupValue !== undefined) {
        if (value !== undefined) {
          cloneProps.checked = getCheckedFromValue(value, groupValue)
        } else {
          // Assumes some sort of intermediate component, forward the
          // group value so it can do its own calculations with it.
          cloneProps.value = groupValue
        }
      } else if (cloneProps.defaultChecked === undefined) {
        if (defaultChecked) {
          cloneProps.defaultChecked = name ? !!defaultChecked[name] : defaultChecked
        } else if (defaultValue !== undefined) {
          if (value !== undefined) {
            cloneProps.defaultChecked = getCheckedFromValue(value, defaultValue)
          } else {
            cloneProps.defaultValue = defaultValue
          }
        }
      }
    }
    // This is to avert a PropTypes warning regarding missing onChange handler.
    if (hasOnChange && cloneProps.checked !== undefined && !cloneProps.onChange) {
      cloneProps.onChange = noop
    }
    return React.cloneElement(element, cloneProps)
  }
  rest.children = cloneAll(rest.children, forwardProps, cloneWithValue)
  return rest
}

const CheckableGroup: React.FC<GroupProps> = (props) => {
  const { children, ...fieldProps } = useCheckableGroupProps(props)
  return (
    <AccessibleField role="group" {...fieldProps}>
      {() => <Box className="field-input-group">{children}</Box>}
    </AccessibleField>
  )
}

export default CheckableGroup

type MakeGroup = (args: {
  component: React.ComponentType<GroupProps>
  displayName: string
  role?: string
}) => React.FC<GroupProps>

export const makeGroup: MakeGroup = ({ component, displayName, role = 'group' }) => {
  const Group: React.FC<GroupProps> = styled(component).attrs({ role, as: CheckableGroup })``
  Group.displayName = displayName
  return Group
}

export const Fieldset = styled(CheckableGroup)`
  .field-label-row {
    border-bottom: ${(p) => border(p.theme, p.disabled ? 'mediumGray' : 'currentcolor')};
  }
  .field-input-group {
    margin: 0 ${(p) => p.theme.space[4]}px;
    padding-top: ${(p) => p.theme.space[3]}px;
  }
`

export const FlexGroup = styled(CheckableGroup)`
  .field-input-group {
    display: flex;
    flex-wrap: wrap;
    ${(p) => (!isIE ? `gap: ${p.theme.space[3]}px;` : `> * { margin: ${p.theme.space[2]}px; }`)}
  }
`
