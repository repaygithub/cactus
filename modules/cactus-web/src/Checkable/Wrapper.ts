import React from 'react'
import styled from 'styled-components'
import { MarginProps } from 'styled-system'

export type CheckableProps = MarginProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'ref'>

export const WrapperLabel = styled.label`
  display: inline-block;
  position: relative;
  cursor: pointer;

  > input {
    position: absolute;
    opacity: 0;
    transform: scale(0);
    z-index: -1;
  }
`

// TODO This is for `RadioButton` and `CheckBox`, to be implemented later.
export const svgStyles = `
  display: block;
  box-sizing: border-box;
  font-size: 16px;
  width: 1em;
  height: 1em;
  vertical-align: -1px; /* TODO may change, Hector mentioned he thought it was too high */
  line-height: 1; /* TODO is this actually needed? */
  color: transparent;
  background-color: transparent;
`
