import { StatusCheck } from '@repay/cactus-icons'
import { BorderSize } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { boxShadow } from '../helpers/theme'

export interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement>, MarginProps {
  id: string
}

interface StyledCheckBoxProps {
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

const getBorder = (borderSize: BorderSize): ReturnType<typeof css> => borderMap[borderSize]

const CheckBoxBase = React.forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) => {
  const componentProps = omitMargins<CheckBoxProps>(props)
  const { disabled, id, className, ...checkBoxProps } = componentProps
  return (
    <label className={className} htmlFor={id}>
      <HiddenCheckBox id={id} ref={ref} disabled={disabled} {...checkBoxProps} />
      <StyledCheckBox aria-hidden={true} disabled={disabled}>
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

const StyledCheckBox = styled.span<StyledCheckBoxProps>`
  display: inline-block;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  ${(p): ReturnType<typeof css> => getBorder(p.theme.border)}
  border-color: ${(p): string =>
    p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkestContrast};
  background: ${(p): string => (p.disabled ? p.theme.colors.lightGray : 'none')};
  border-radius: 1px;
  svg {
    visibility: hidden;
    display: block;
    color: ${(p): string => p.theme.colors.white};
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
  cursor: ${(p): string => (p.disabled ? 'cursor' : 'pointer')};
  input:checked ~ span {
    border-color: ${(p): string | undefined =>
      !p.disabled ? p.theme.colors.callToAction : undefined};
    background-color: ${(p): string | undefined =>
      !p.disabled ? p.theme.colors.callToAction : undefined};
  }

  input:checked ~ span {
    svg {
      visibility: visible;
    }
  }

  input:focus ~ span {
    ${(p): string => boxShadow(p.theme, 1)};
  }

  ${margin}
`

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

CheckBox.defaultProps = {
  disabled: false,
}

export default CheckBox
