import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { ExtFieldProps } from '../AccessibleField/AccessibleField'
import { Fieldset } from '../Checkable/Group'
import CheckBoxField, { CheckBoxFieldProps } from '../CheckBoxField/CheckBoxField'

interface CheckBoxGroupProps extends Omit<ExtFieldProps, 'role'> {
  checked?: Record<string, any> // `any` instead of `boolean` to work better with form libs.
  required?: boolean
}

type CheckBoxGroupItemProps = Omit<CheckBoxFieldProps, 'required'>
const CheckBoxGroupItem = React.forwardRef<HTMLInputElement, CheckBoxGroupItemProps>(
  (props: any, ref) => <CheckBoxField ref={ref} {...props} />
)
CheckBoxGroupItem.displayName = 'CheckBoxGroup.Item'

// This is a restriction of the allowable props in CheckableGroup.
interface CheckBoxGroupType extends React.FC<CheckBoxGroupProps> {
  Item: typeof CheckBoxGroupItem
}

export const CheckBoxGroup: CheckBoxGroupType = styled(Fieldset).attrs({ role: 'group' })`` as any
CheckBoxGroup.displayName = 'CheckBoxGroup'
CheckBoxGroup.Item = CheckBoxGroupItem

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

export default CheckBoxGroup
