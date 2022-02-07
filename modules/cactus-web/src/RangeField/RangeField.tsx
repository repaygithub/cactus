import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import AccessibleField, { FieldProps } from '../AccessibleField/AccessibleField'
import { extractFieldStyleProps } from '../helpers/omit'
import { Range, RangeProps } from '../Range/Range'

interface RangeFieldProps extends FieldProps, Omit<RangeProps, 'name' | 'status'> {}

const RangeFieldBase = React.forwardRef<HTMLInputElement, RangeFieldProps>(
  (props: RangeFieldProps, ref) => {
    const {
      id,
      name,
      label,
      labelProps,
      success,
      warning,
      error,
      tooltip,
      tooltipProps,
      disabled,
      autoTooltip,
      disableTooltip,
      alignTooltip,
      ...inputProps
    } = props
    const styleProps = extractFieldStyleProps(inputProps)

    return (
      <AccessibleField
        disabled={disabled}
        id={id}
        name={name}
        label={label}
        labelProps={labelProps}
        success={success}
        warning={warning}
        error={error}
        tooltip={tooltip}
        tooltipProps={tooltipProps}
        autoTooltip={autoTooltip}
        disableTooltip={disableTooltip}
        alignTooltip={alignTooltip}
        {...styleProps}
      >
        <Range ref={ref} {...inputProps} width="100%" marginY={2} />
      </AccessibleField>
    )
  }
)

export const RangeField = styled(RangeFieldBase)`
  position: relative;
`

RangeField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  labelProps: PropTypes.object,
  success: PropTypes.node,
  warning: PropTypes.node,
  error: PropTypes.node,
  tooltip: PropTypes.node,
  tooltipProps: PropTypes.object,
}

export default RangeField
