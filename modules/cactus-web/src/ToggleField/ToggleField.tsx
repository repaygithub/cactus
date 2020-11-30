import PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'styled-components'

import FieldWrapper from '../FieldWrapper/FieldWrapper'
import { extractMargins } from '../helpers/omit'
import useId from '../helpers/useId'
import Label, { LabelProps } from '../Label/Label'
import Toggle, { ToggleProps } from '../Toggle/Toggle'

export interface ToggleFieldProps extends ToggleProps {
  label: React.ReactNode
  /** props to be passed to the Label element (available for accessibility considerations) */
  labelProps?: Omit<LabelProps, 'children' | 'htmlFor'>
  id?: string
  /** required for form state management */
  name: string
  checked?: boolean
  disabled?: boolean
}

export const ToggleField = React.forwardRef<HTMLInputElement, ToggleFieldProps>(
  ({ className, disabled, id, label, labelProps, ...props }, ref): React.ReactElement => {
    const marginProps = extractMargins(props)
    const fieldId = useId(id, props.name)

    return (
      <ToggleFieldWrapper {...marginProps} $disabled={disabled} className={className}>
        <Toggle {...props} disabled={disabled} id={fieldId} ref={ref} />
        <Label {...labelProps} htmlFor={fieldId}>
          {label}
        </Label>
      </ToggleFieldWrapper>
    )
  }
)

const ToggleFieldWrapper = styled(FieldWrapper)<{ $disabled?: boolean }>`
  ${Label} {
    cursor: ${(p): string => (p.$disabled ? 'not-allowed' : 'pointer')};
    margin-left: 8px;
    line-height: 26px;
    vertical-align: -2px;
    ${(p) => p.$disabled && `color: ${p.theme.colors.mediumGray}`};
  }

  ${Toggle.toString()} {
    vertical-align: middle;
  }
`

ToggleField.propTypes = {
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
}

ToggleField.displayName = 'ToggleField'
export default ToggleField
