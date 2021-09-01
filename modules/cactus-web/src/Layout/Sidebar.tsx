import React from 'react'
import styled from 'styled-components'

import { insetBorder } from '../helpers/theme'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { useLayout } from './Layout'
import { classes } from '../helpers/styled'

const WIDTH = 60

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  layoutRole: string
}

type SidebarType = React.FC<SidebarProps> & { Button: ReturnType<typeof styled.button> }

export const Sidebar: SidebarType = ({ layoutRole, className, ...props }) => {
  const size = React.useContext(ScreenSizeContext)
  let position: 'leftCol' | 'left' | 'bottom' = 'leftCol'
  if (size < SIZES.small) {
    position = 'bottom'
  } else if (size < SIZES.large) {
    position = 'left'
  }
  const offset = React.Children.toArray(props.children).length ? WIDTH : 0
  const layoutClass = useLayout(layoutRole, { [position]: offset }, 1)
  return <SidebarDiv {...props} className={classes(className, layoutClass)} />
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
Sidebar.Button.defaultProps = { role: 'button', type: 'button' }

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
    ${(p) => insetBorder(p.theme, 'lightContrast', 'right')};
    ${Sidebar.Button} {
      ${(p) => insetBorder(p.theme, 'lightContrast', 'bottom')};
      :hover {
        ${(p) => insetBorder(p.theme, 'callToAction', 'bottom')};
      }
    }
  }

  &.cactus-layout-fixedBottom {
    flex-direction: row;
    justify-content: flex-end;
    ${(p) => insetBorder(p.theme, 'lightContrast', 'top')};
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
