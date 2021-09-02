import React from 'react'
import styled from 'styled-components'

import { classes } from '../helpers/styled'
import { insetBorder } from '../helpers/theme'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { useLayout } from './Layout'

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

export const positionPanel = (popup: HTMLElement): void => {
  const parent = popup.offsetParent
  if (parent) {
    const rect = parent.getBoundingClientRect()
    if (parent.matches('.cactus-fixed-bottom')) {
      popup.style.top = 'unset'
      popup.style.left = '0'
      popup.style.bottom = `${rect.height}px`
      popup.style.right = '0'
      popup.style.maxHeight = `${rect.top}px`
      popup.style.boxShadow = 'none'
      popup.style.width = 'auto'
    } else if (parent.matches('.cactus-fixed-left, .cactus-rel-leftCol')) {
      popup.style.top = '0'
      popup.style.left = `${rect.width}px`
      popup.style.bottom = '0'
      popup.style.right = 'unset'
      popup.style.maxHeight = ''
      popup.style.boxShadow = ''
      // This indicates a `width` prop has been used to override the default width.
      popup.style.width = !popup.hasAttribute('width') ? 'max-content' : ''
    }
  }
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
  z-index: 100;
  box-sizing: border-box;
  display: flex;
  :empty {
    display: none;
  }

  &.cactus-rel-leftCol,
  &.cactus-fixed-left {
    flex-direction: column;
    ${(p) => insetBorder(p.theme, 'lightContrast', 'right')};
    ${Sidebar.Button} {
      ${(p) => insetBorder(p.theme, 'lightContrast', 'bottom')};
      :hover {
        ${(p) => insetBorder(p.theme, 'callToAction', 'bottom')};
      }
    }
  }

  &.cactus-fixed-bottom {
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
