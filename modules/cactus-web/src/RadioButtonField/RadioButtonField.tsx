import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { omitMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import RadioButton, { RadioButtonProps } from '../RadioButton/RadioButton'

export interface RadioButtonFieldProps extends Omit<RadioButtonProps, 'id'>, MarginProps {
  label: React.ReactNode
  name: string
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
}

const RadioButtonFieldBase = React.forwardRef<HTMLInputElement, RadioButtonFieldProps>(
  (props, ref) => {
    const { label, labelProps, id, className, name, ...radioButtonProps } = omitMargins(
      props
    ) as Omit<RadioButtonFieldProps, keyof MarginProps>
    const radioButtonId = useId(id, name)

    return (
      <FieldWrapper className={className}>
        <RadioButton ref={ref} id={radioButtonId} name={name} {...radioButtonProps} />
        <Label {...labelProps} htmlFor={radioButtonId}>
          {label}
        </Label>
      </FieldWrapper>
    )
  }
)

export const RadioButtonField = styled(RadioButtonFieldBase)`
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

RadioButtonField.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
}

RadioButtonField.defaultProps = {
  labelProps: {},
  disabled: false,
}

export default RadioButtonField
