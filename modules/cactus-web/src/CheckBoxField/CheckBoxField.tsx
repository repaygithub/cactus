import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import CheckBox, { CheckBoxProps } from '../CheckBox/CheckBox'
import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { FlexItemProps } from '../helpers/flexItem'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'

export interface CheckBoxFieldProps
  extends Omit<CheckBoxProps, 'id' | 'disabled'>,
    MarginProps,
    FlexItemProps {
  label: React.ReactNode
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  name: string
  disabled?: boolean
}

const CheckBoxFieldBase = React.forwardRef<HTMLInputElement, CheckBoxFieldProps>((props, ref) => {
  const componentProps = omitMargins(props) as Omit<CheckBoxFieldProps, keyof MarginProps>
  const {
    label,
    labelProps,
    id,
    name,
    className,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    ...checkboxProps
  } = componentProps
  const checkboxId = useId(id, name)

  return (
    <FieldWrapper
      className={className}
      flex={flex}
      flexGrow={flexGrow}
      flexShrink={flexShrink}
      flexBasis={flexBasis}
    >
      <CheckBox {...checkboxProps} ref={ref} id={checkboxId} name={name} />
      <Label {...labelProps} htmlFor={checkboxId}>
        {label}
      </Label>
    </FieldWrapper>
  )
})

export const CheckBoxField = styled(CheckBoxFieldBase)`
  & + & {
    margin-top: 8px;
  }

  ${Label} {
    cursor: ${(p): string => (p.disabled ? 'not-allowed' : 'pointer')};
    padding-left: 8px;
    color: ${(p) => p.disabled && p.theme.colors.mediumGray};
  }

  ${margin}
`

CheckBoxField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

CheckBoxField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default CheckBoxField
