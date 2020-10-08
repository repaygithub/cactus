import React from 'react'
import styled from 'styled-components'

import { Direction, insetBorder, Props as ThemeProps } from '../helpers/theme'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { Position, Role, useLayout } from './Layout'

const WIDTH = 60

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  layoutRole: Role
}

type SidebarType = React.FC<SidebarProps> & { Button: ReturnType<typeof styled.button> }

export const Sidebar: SidebarType = ({ layoutRole, className, ...props }) => {
  const size = React.useContext(ScreenSizeContext)
  let position: Position = 'floatLeft'
  if (size < SIZES.small) {
    position = 'fixedBottom'
  } else if (size < SIZES.large) {
    position = 'fixedLeft'
  }
  const { cssClass } = useLayout(layoutRole, { position, offset: WIDTH })
  className = className ? `${className} ${cssClass}` : cssClass
  return <SidebarDiv {...props} className={className} />
}

Sidebar.Button = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  text-align: left;
  color: inherit;
  font: inherit;
  box-sizing: border-box;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  width: ${WIDTH}px;
  height: ${WIDTH}px;
  padding: 8px;

  img,
  svg {
    width: 24px;
    height: 24px;
  }

  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }

  &&&&:focus {
    ${(p) => insetBorder(p.theme, 'callToAction')};
  }

  &&&&[aria-expanded='true'] {
    ${(p) => p.theme.colorStyles.callToAction};
    box-shadow: none;
  }
`
Sidebar.Button.defaultProps = { role: 'button' }

const borders = ({ theme }: ThemeProps, border: Direction, buttonBorder: Direction) => `
  ${insetBorder(theme, 'lightContrast', border)};
  ${Sidebar.Button} {
    ${insetBorder(theme, 'lightContrast', buttonBorder)};
    :hover {
      ${insetBorder(theme, 'callToAction', buttonBorder)};
    }
  }
`

// `position: relative` to make it easier to position panel popups.
const SidebarDiv = styled.div`
  ${(p) => p.theme.colorStyles.standard};
  position: relative;
  box-sizing: border-box;
  display: flex;
  :empty {
    display: none;
  }

  &.cactus-layout-floatLeft,
  &.cactus-layout-fixedLeft {
    flex-direction: column;
    ${(p) => borders(p, 'right', 'bottom')};
  }

  &.cactus-layout-fixedBottom {
    flex-direction: row;
    ${(p) => borders(p, 'top', 'right')};
    ${Sidebar.Button}[aria-expanded='true']::after {
      content: '';
      z-index: 99;
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      bottom: ${WIDTH}px;
      left: 0;
      right: 0;
      cursor: default;
    }
  }
`
