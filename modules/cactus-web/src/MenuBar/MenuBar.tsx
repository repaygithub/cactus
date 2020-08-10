import {
  NavigationChevronDown,
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationChevronUp,
} from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { isActionKey, keyPressAsClick } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
import { border, boxShadow, radius } from '../helpers/theme'
import {
  focusMenu,
  ITEM_SELECTOR,
  menuKeyHandler,
  useScrollButtons,
  useSubmenuKeyHandlers,
  useSubmenuToggle,
} from './scroll'

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

const preventAction = (event: React.KeyboardEvent<HTMLElement>) => {
  if (isActionKey(event)) {
    event.preventDefault()
  }
}

function MenuBarItemFunc<E, C extends GenericComponent = 'button'>(
  props: AsProps<C>,
  ref: React.Ref<E>
) {
  // The `as any` here is to enable proper use of link substition,
  // e.g. <MenuBar.Item as="a" href="go/go/power/rangers" />
  const propsCopy = { ...props } as any
  if (!propsCopy.onKeyPress) {
    propsCopy.onKeyPress = keyPressAsClick
  }
  const original = propsCopy.onKeyUp
  propsCopy.onKeyUp = !original
    ? preventAction
    : (e: React.KeyboardEvent<HTMLElement>) => {
        original(e)
        preventAction(e)
      }
  return (
    <li role="none">
      <MenuButton ref={ref as any} {...propsCopy} />
    </li>
  )
}

type MenuBarItemType = typeof MenuBarItemFunc

// Tell Typescript to treat this as a regular functional component,
// even though React knows it's a `forwardRef` component.
const MenuBarItemFR = React.forwardRef(MenuBarItemFunc) as any
const MenuBarItem = MenuBarItemFR as MenuBarItemType

MenuBarItemFR.displayName = 'MenuBarItem'

MenuBarItemFR.propTypes = {
  tabIndex: function (props: Record<string, any>): Error | null {
    if (props.tabIndex !== undefined) {
      return new Error('`tabIndex` is set programmatically, not using props')
    }
    return null
  },
  role: function (props: Record<string, any>): Error | null {
    if (props.role && props.role !== 'menuitem') {
      return new Error('`menuitem` is the only allowable ARIA role')
    }
    return null
  },
}

const MenuBarList = React.forwardRef<HTMLButtonElement, ListProps>(
  ({ title, children, ...props }, ref) => {
    const [expanded, toggle] = useSubmenuToggle()

    const [toggleOnKey, handleSubmenu] = useSubmenuKeyHandlers(toggle)

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
      <li role="none" onKeyDown={handleSubmenu} onBlur={closeOnBlur}>
        <MenuButton
          {...props}
          ref={ref}
          aria-haspopup="menu"
          aria-expanded={expanded}
          onClick={toggleOnClick}
          onKeyDown={toggleOnKey}
          onKeyUp={preventAction}
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
  flex-shrink: 1;
`

const TextWrapper = styled.div`
  flex-grow: 1;
`

const Menu: React.FC<MenuProps> = ({ children, expanded }) => {
  const [scroll, menuRef] = useScrollButtons('vertical', expanded)
  return (
    <MenuWrapper expanded={expanded} tabIndex={-1}>
      <ScrollButton show={scroll.showBack} onClick={scroll.clickBack}>
        <NavigationChevronUp />
      </ScrollButton>
      <MenuList
        role="menu"
        aria-orientation="vertical"
        ref={menuRef}
        onFocus={focusMenu}
        onKeyDown={menuKeyHandler}
      >
        {children}
      </MenuList>
      <ScrollButton show={scroll.showFore} onClick={scroll.clickFore}>
        <NavigationChevronDown />
      </ScrollButton>
    </MenuWrapper>
  )
}

const MenuBar = React.forwardRef<HTMLElement, MenuBarProps>(({ children, ...props }, ref) => {
  const [scroll, menuRef, menu] = useScrollButtons('horizontal', true)

  React.useEffect(() => {
    if (menu) {
      // There doesn't seem to be any way in React to consistently identify the
      // first descendent of a particular type, so instead we'll use this event
      // to ensure that even if elements are dynamically added or removed, the
      // first menuitem will always get tab focus for the whole component.
      const mutationCallback = () => {
        const menuItems = menu.querySelectorAll(ITEM_SELECTOR)
        if (menuItems.length) {
          ;(menuItems[0] as HTMLElement).tabIndex = 0
          for (let i = 1; i < menuItems.length; i++) {
            ;(menuItems[i] as HTMLElement).tabIndex = -1
          }
        }
      }
      const observer = new MutationObserver(mutationCallback)
      observer.observe(menu, { childList: true, subtree: true })
      mutationCallback()
      return () => observer.disconnect()
    }
  }, [menu])
  return (
    <Nav {...props} ref={ref} tabIndex={-1} onClick={navClickHandler}>
      <ScrollButton show={scroll.showBack} onClick={scroll.clickBack}>
        <NavigationChevronLeft />
      </ScrollButton>
      <MenuList
        role="menubar"
        aria-orientation="horizontal"
        ref={menuRef}
        onFocus={focusMenu}
        onKeyDown={menuKeyHandler}
      >
        {children}
      </MenuList>
      <ScrollButton show={scroll.showFore} onClick={scroll.clickFore}>
        <NavigationChevronRight />
      </ScrollButton>
    </Nav>
  )
})

const navClickHandler = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.target as HTMLElement
  if (button.matches && button.matches('[role="menuitem"]:not([aria-haspopup])')) {
    event.currentTarget.focus()
  }
}

MenuBar.displayName = 'MenuBar'
MenuBar.propTypes = { 'aria-label': PropTypes.string }
MenuBar.defaultProps = { 'aria-label': 'Main Menu' }

type ExportedMenuBarType = typeof MenuBar & {
  List: typeof MenuBarList
  Item: MenuBarItemType
}

const TypedMenuBar = MenuBar as ExportedMenuBarType
TypedMenuBar.List = MenuBarList
TypedMenuBar.Item = MenuBarItem

export { TypedMenuBar as MenuBar, MenuBarList, MenuBarItem }

export default TypedMenuBar

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
  outline: none;
  ${(p) => p.theme.textStyles.small};
  ${(p) => p.theme.colorStyles.standard};
  box-shadow: inset 0 -${(p) => border(p.theme, 'lightContrast').replace('solid', '0')};

  [role='menubar'] > li > [role='menuitem'] {
    white-space: nowrap;
    padding: 20px 8px;
    border: ${(p) => border(p.theme, 'transparent')};
    border-bottom-color: ${(p) => p.theme.colors.lightContrast};
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
  display: flex;
  visibility: ${(p) => (p.expanded ? 'visible' : 'hidden')};
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

  [role='menuitem'] {
    padding: 4px 8px;

    ${NavigationChevronDown} {
      transform: rotateZ(-90deg);
    }
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
    top: 0px;
    left: 0px;
  }
`

const MenuButton = styled.button.attrs({ role: 'menuitem' })`
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
