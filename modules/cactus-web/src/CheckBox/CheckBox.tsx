import { StatusCheck } from '@repay/cactus-icons'
import { border, borderSize, color, shadow } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'

export interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement>, MarginProps {
  id?: string
}

const CheckBoxBase = React.forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) => {
  const componentProps = omitMargins<CheckBoxProps>(props)
  const { id, className, ...checkBoxProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenCheckBox id={id} ref={ref} {...checkBoxProps} />
      <StyledCheckBox aria-hidden={true}>
        <StatusCheck />
      </StyledCheckBox>
    </label>
  )
})

const HiddenCheckBox = styled.input.attrs({ type: 'checkbox' as string })`
  opacity: 0;
  border: 0;
  width: 0;
  height: 0;
  position: absolute;
`

const StyledCheckBox = styled.span`
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: ${border('darkestContrast')};
  background-color: transparent;
  svg {
    visibility: hidden;
    display: block;
    color: ${color('white')};
    width: 12px;
    height: 12px;
    margin: ${borderSize({ thin: '1px', thick: '0' }) as any};
  }
`

export const CheckBox = styled(CheckBoxBase)`
  position: relative;
  display: inline-block;
  vertical-align: -1px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  cursor: ${(p): string => (p.disabled ? 'cursor' : 'pointer')};

  input:checked ~ span {
    border-color: ${color('callToAction')};
    background-color: ${color('callToAction')};
    svg {
      visibility: visible;
    }
  }

  input:focus ~ span {
    ${shadow(1)};
  }

  input:disabled ~ span {
    border-color: ${color('lightGray')};
    background-color: ${color('lightGray')};
  }

  ${margin}
`

CheckBox.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
}

CheckBox.defaultProps = {
  disabled: false,
}

export default CheckBox
