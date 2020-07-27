import {
  NavigationChevronDown,
  NavigationChevronLeft,
  NavigationChevronRight,
} from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { border, boxShadow, radius } from '../helpers/theme'
import { Omit } from '../types'
import {
  ITEM_SELECTOR,
  menuKeyHandler,
  useScrollButtons,
  useSubmenuKeyHandler,
  useSubmenuToggle,
} from './scroll'

interface MenuItemProps
  extends Omit<React.AllHTMLAttributes<HTMLElement>, 'as' | 'tabIndex' | 'role'> {
  as?: React.ReactType
}

interface ListProps {
  children: React.ReactNode
  title: React.ReactNode
  'aria-current'?: boolean
}

interface MenuProps {
  children: React.ReactNode
  expanded: boolean
}

interface MenuBarProps {
  children: React.ReactNode
  'aria-label'?: string
}

// The `as any` here is to enable proper use of link substition,
// e.g. <MenuBar.Item as="a" href="go/go/power/rangers" />
const MenuBarItem = React.forwardRef<HTMLElement, MenuItemProps>((props, ref) => (
  <li role="none">
    <MenuButton ref={ref as any} {...(props as any)} />
  </li>
))

const MenuBarList = React.forwardRef<HTMLButtonElement, ListProps>(
  ({ title, children, ...props }, ref) => {
    const [expanded, toggle] = useSubmenuToggle()

    const onKeyDown = useSubmenuKeyHandler(toggle)

    const closeOnBlur = React.useCallback(
      (event) => {
        const target = event.currentTarget
        setTimeout(() => {
          if (!target.contains(document.activeElement)) {
            toggle(null, false)
          }
        })
      },
      [toggle]
    )
    const toggleOnClick = React.useCallback(
      (event) => {
        toggle(event.currentTarget, undefined)
      },
      [toggle]
    )
    return (
      <li role="none" onKeyDown={onKeyDown} onBlur={closeOnBlur}>
        <MenuButton
          {...props}
          ref={ref}
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={toggleOnClick}
        >
          <TextWrapper>{title}</TextWrapper>
          <IconWrapper aria-hidden>
            <NavigationChevronDown />
          </IconWrapper>
        </MenuButton>
        <Menu expanded={expanded}>{children}</Menu>
      </li>
    )
  }
)

MenuBarList.propTypes = {
  title: PropTypes.node.isRequired,
}

const IconWrapper = styled.div`
  flex-shrink: 0;
`

const TextWrapper = styled.div`
  flex-grow: 1;
`

const Menu: React.FC<MenuProps> = ({ children, expanded }) => {
  const [scroll, menuRef] = useScrollButtons('vertical', expanded)
  return (
    <MenuWrapper expanded={expanded} tabIndex={-1}>
      <ScrollButton show={scroll.showBack} onClick={scroll.clickBack}>
        <NavigationChevronLeft />
      </ScrollButton>
      <MenuList
        role="menu"
        aria-orientation="vertical"
        ref={menuRef}
        onKeyDown={menuKeyHandler}
        top={scroll.top}
      >
        {children}
      </MenuList>
      <ScrollButton show={scroll.showFore} onClick={scroll.clickFore}>
        <NavigationChevronRight />
      </ScrollButton>
    </MenuWrapper>
  )
}

const enterNavFocus = (event: React.FocusEvent<HTMLElement>) => {
  if (event.currentTarget === event.target) {
    const firstItem = event.target.querySelector(ITEM_SELECTOR)
    if (firstItem) {
      ;(firstItem as HTMLElement).focus()
    }
  }
  // TODO Doesn't work quite right on IE, but it's close enough; if I end up adding a context
  // for the sidebar styling, I may be able to fix it with an alternate implementation.
  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
    event.currentTarget.tabIndex = -1
  }
}

const exitNavFocus = (event: React.FocusEvent<HTMLElement>) => {
  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
    event.currentTarget.tabIndex = 0
  }
}

const MenuBar = React.forwardRef<HTMLElement, MenuBarProps>(({ children, ...props }, ref) => {
  const [scroll, menuRef] = useScrollButtons('horizontal', true)
  return (
    <Nav {...props} ref={ref} tabIndex={0} onFocus={enterNavFocus} onBlur={exitNavFocus}>
      <ScrollButton show={scroll.showBack} onClick={scroll.clickBack}>
        <NavigationChevronLeft />
      </ScrollButton>
      <MenuList
        role="menubar"
        aria-orientation="horizontal"
        ref={menuRef}
        onKeyDown={menuKeyHandler}
        left={scroll.left}
      >
        {children}
      </MenuList>
      <ScrollButton show={scroll.showFore} onClick={scroll.clickFore}>
        <NavigationChevronRight />
      </ScrollButton>
    </Nav>
  )
})

MenuBar.displayName = 'MenuBar'
MenuBar.propTypes = { 'aria-label': PropTypes.string }
MenuBar.defaultProps = { 'aria-label': 'Main Menu' }

type MenuBarType = typeof MenuBar & {
  List: typeof MenuBarList
  Item: typeof MenuBarItem
}

const DefaultMenuBar = MenuBar as MenuBarType
DefaultMenuBar.List = MenuBarList
DefaultMenuBar.Item = MenuBarItem

export { MenuBar, MenuBarList, MenuBarItem }

export default DefaultMenuBar

const ScrollButton = styled.div.attrs({ 'aria-hidden': true })<{ show?: boolean }>`
  ${(p) => p.theme.colorStyles.standard};
  display: ${(p) => (p.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  background-color: transparent;
  text-align: center;
  outline: none;
  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }
  svg {
    width: 18px;
    height: 18px;
    margin: 8px;
  }
`

const Nav = styled.nav`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
  ${(p) => p.theme.textStyles.small};
  ${(p) => p.theme.colorStyles.standard};

  [role='menubar'] > li > [role='menuitem'] {
    white-space: nowrap;
    padding: 20px 8px;
    border: ${(p) => border(p.theme, 'transparent')};
    border-bottom: ${(p) => border(p.theme, 'lightContrast')};
    &:hover,
    &[aria-expanded='true'] {
      color: ${(p) => p.theme.colors.callToAction};
      border-bottom-color: ${(p) => p.theme.colors.callToAction};
    }
    &:focus {
      border: ${(p) => border(p.theme, 'callToAction')};
    }
    &[aria-current='true'] {
      font-weight: bold;
    }
  }
`

const MenuWrapper = styled.div<{ expanded: boolean }>`
  ${(p) => p.theme.colorStyles.standard};
  display: ${(p) => (p.expanded ? 'flex' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  outline: none;
  border: ${(p) => border(p.theme, 'lightContrast')};
  border-radius: ${radius};
  ${(p) => boxShadow(p.theme, 1)};
  white-space: normal;
  flex-flow: column nowrap;
  align-items: stretch;
  min-width: 200px;
  max-width: 320px;
  max-height: 70vh;
  z-index: 1;

  ul {
    width: 100%;
  }

  ${NavigationChevronLeft}, ${NavigationChevronRight} {
    transform: rotateZ(90deg);
  }
  ${NavigationChevronDown} {
    transform: rotateZ(-90deg);
  }

  [role='menuitem'] {
    padding: 4px 8px;
    &[aria-expanded='true'] {
      background-color: ${(p) => p.theme.colors.lightContrast};
      ${NavigationChevronDown} {
        transform: rotateZ(90deg);
      }
    }
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:focus {
      background-color: ${(p) => p.theme.colors.lightContrast};
      color: ${(p) => p.theme.colors.callToAction};
    }
  }
`

const MenuList = styled.ul<{ top?: number; left?: number }>`
  list-style: none;
  display: flex;
  flex-direction: ${(p) => (p['aria-orientation'] === 'vertical' ? 'column' : 'row')};
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-grow: 1;
  padding: 0;
  margin: 0;
  align-items: stretch;

  overflow: hidden;

  & > li > [role='menuitem'] {
    position: relative;
    top: ${(p) => p.top || 0}px;
    left: ${(p) => p.left || 0}px;
  }
`

const MenuButton = styled.button.attrs({ tabIndex: -1, role: 'menuitem' })`
  cursor: pointer;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  background-color: transparent;
  text-decoration: none;
  text-align: left;
  color: inherit;
  font: inherit;
  display: flex;
  box-sizing: border-box;
  align-items: center;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }

  ${NavigationChevronDown} {
    width: 8px;
    height: 8px;
    margin-left: 16px;
    ${(p) => (p['aria-expanded'] ? 'transform: scaleY(-1);' : undefined)}
  }
`
