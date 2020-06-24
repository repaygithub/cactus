import React from 'react'

import { BorderSize } from '@repay/cactus-theme'
import { margin, MarginProps } from 'styled-system'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import { StatusCheck } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

export interface CheckBoxProps
  extends Omit<
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
      'ref'
    >,
    MarginProps {
  id: string
  disabled?: boolean
}

interface StyledCheckBoxProps extends React.HTMLProps<HTMLSpanElement> {
  disabled?: boolean
}

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
    svg {
      margin: 1px;
    }
  `,
  thick: css`
    border: 2px solid;
  `,
}

const getBorder = (borderSize: BorderSize) => borderMap[borderSize]

const CheckBoxBase = (props: CheckBoxProps) => {
  const componentProps = omitMargins<CheckBoxProps>(props)
  const { disabled, id, className, ...checkBoxProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenCheckBox id={id} disabled={disabled} {...checkBoxProps} />
      <StyledCheckBox aria-hidden={true} disabled={disabled}>
        <StatusCheck />
      </StyledCheckBox>
    </label>
  )
}

const HiddenCheckBox = styled.input.attrs({ type: 'checkbox' as string })`
  opacity: 0;
  border: 0;
  width: 0;
  height: 0;
  position: absolute;
`

const StyledCheckBox = styled.span<StyledCheckBoxProps>`
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  ${(p) => getBorder(p.theme.border)}
  border-color: ${(p) => (p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkestContrast)};
  background: ${(p) => (p.disabled ? p.theme.colors.lightGray : 'none')};
  border-radius: 1px;
  svg {
    visibility: hidden;
    display: block;
    color: ${(p) => p.theme.colors.white};
    width: 12px;
    height: 12px;
  }
`

export const CheckBox = styled(CheckBoxBase)`
  position: relative;
  display: inline-block;
  vertical-align: -1px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  cursor: ${(p) => (p.disabled ? 'cursor' : 'pointer')};
  input:checked ~ span {
    border-color: ${(p) => !p.disabled && p.theme.colors.callToAction};
    background-color: ${(p) => !p.disabled && p.theme.colors.callToAction};
  }

  input:checked ~ span {
    svg {
      visibility: visible;
    }
  }

  input:focus ~ span {
    ${(p) => p.theme.boxShadows && `box-shadow: 0 0 8px ${p.theme.colors.callToAction};`}
  }

  ${margin}
`

// @ts-ignore
CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

CheckBox.defaultProps = {
  disabled: false,
}

export default CheckBox
