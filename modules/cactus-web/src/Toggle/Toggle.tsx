import React from 'react'
import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { StatusCheck, NavigationClose } from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'

export type ShadowVariants = 's0' | 's1' | 's2' | 's3' | 's4' | 's5'

type ShadowMap = { [K in ShadowVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const shadowMap: ShadowMap = {
  s0: css`
    box-shadow: 0 0 3px ${p => p.theme.colors.callToAction};
  `,
  s1: css`
    box-shadow: 0 3px 8px ${p => p.theme.colors.callToAction};
  `,
  s2: css`
    box-shadow: 0 9px 24px ${p => p.theme.colors.callToAction};
  `,
  s3: css`
    box-shadow: 0 12px 24px ${p => p.theme.colors.callToAction};
  `,
  s4: css`
    box-shadow: 0 30px 42px ${p => p.theme.colors.callToAction};
  `,
  s5: css`
    box-shadow: 0 45px 46px ${p => p.theme.colors.callToAction};
  `,
}

const chooseShadow = (
  props: ToggleProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  if (props.shadowVariant !== undefined && !props.disabled && props.shadows) {
    return shadowMap[props.shadowVariant]
  }
}

interface ToggleProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'value' | 'ref' | 'as'> {
  val: boolean
  disabled?: boolean
  shadows?: boolean
  shadowVariant?: ShadowVariants
}

const StyledX = styled(NavigationClose)`
  width: 18px;
  height: 18px;
  color: ${p => p.theme.colors.white};
`

const StyledCheck = styled(StatusCheck)`
  width: 18px;
  height: 18px;
  color: ${p => p.theme.colors.white};
`

const ToggleButton = styled.button<ToggleProps>`
  position: relative;
  width: 45px;
  height: 20px;
  border-radius: 10px;
  outline: none;
  background-color: ${p => p.theme.colors.base};
  border: 1px solid ${p => p.theme.colors.base};
  cursor: ${p => (p.disabled ? 'cursor' : 'pointer')};

  ::after {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    transition: transform 0.3s;
    background-color: ${p => p.theme.colors.white};
  }

  &[aria-checked='true'] {
    background-color: ${p => p.theme.colors.callToAction};
    border-color: ${p => p.theme.colors.callToAction};

    ::after {
      transform: translateX(25px);
    }

    ${StyledX} {
      opacity: 0;
    }

    ${StyledCheck} {
      opacity: 1;
    }
  }

  ${StyledX} {
    position: absolute;
    top: 0;
    left: 20px;
    opacity: 1;
    transition: opacity 0.3s;
  }

  ${StyledCheck} {
    position: absolute;
    top: 0;
    left: 4px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &[disabled] {
    background-color: ${p => p.theme.colors.lightGray};
    border-color: ${p => p.theme.colors.lightGray};
  }

  // Experimental properties; may not use
  &:hover,
  &:focus {
    ${chooseShadow};
  }
`

const Toggle = (props: ToggleProps) => {
  return (
    <ToggleButton aria-checked={props.val} {...props}>
      <StyledX />
      <StyledCheck />
    </ToggleButton>
  )
}

export default Toggle
