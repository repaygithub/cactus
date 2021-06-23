import { DescriptiveProfile, NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { ActionBar } from '../ActionBar/ActionBar'
import { OrderHint, useAction } from '../ActionBar/ActionProvider'
import Flex from '../Flex/Flex'
import { getViewport, usePositioning } from '../helpers/positionPopover'
import { border, boxShadow, insetBorder, radius, textStyle } from '../helpers/theme'
import usePopup, { TogglePopup } from '../helpers/usePopup'
import { Sidebar } from '../Layout/Sidebar'
import { MenuItemFunc, MenuItemType } from '../MenuItem/MenuItem'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'
import { SidebarMenu as ActionMenuPopup } from '../SidebarMenu/SidebarMenu'

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  mobileIcon?: React.ReactElement
  orderHint?: OrderHint
}

interface UserMenuProps {
  id?: string
  isProfilePage?: boolean
  label: React.ReactNode
}

interface ProfileStyleProp {
  $isProfilePage?: boolean
}

interface BrandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
}
// Tell Typescript to treat this as a regular functional component,
// even though React knows it's a `forwardRef` component.
const MenuItemFR = React.forwardRef(MenuItemFunc) as any
const MenuItem = MenuItemFR as MenuItemType

export const BrandBarUserMenu: React.FC<UserMenuProps> = (props) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const MenuComponent = isTiny ? ActionBarUserMenu : UserMenu
  return <MenuComponent {...props} />
}

export const BrandBarItem: React.FC<ItemProps> = ({ mobileIcon, ...props }) => {
  const isTiny = SIZES.tiny === useScreenSize()
  if (isTiny && mobileIcon) {
    return <ActionBar.Panel aria-label="" {...props} icon={mobileIcon} />
  }
  return <>{props.children}</>
}

type BrandBarType = React.FC<BrandBarProps> & {
  Item: typeof BrandBarItem
  UserMenu: typeof BrandBarUserMenu
  UserMenuItem: typeof MenuItem
}

export const BrandBar: BrandBarType = ({ logo, children, ...props }) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const justify = isTiny ? 'center' : 'flex-end'
  return (
    <StyledBrandBar {...props} $isTiny={isTiny}>
      <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      <Flex alignItems="flex-end" justifyContent={justify}>
        {children}
      </Flex>
    </StyledBrandBar>
  )
}

BrandBar.displayName = 'BrandBar'
BrandBar.Item = BrandBarItem
BrandBar.UserMenu = BrandBarUserMenu
BrandBar.UserMenuItem = MenuItem

BrandBar.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

BrandBarItem.propTypes = {
  mobileIcon: PropTypes.element,
  orderHint: ActionBar.Panel.propTypes?.orderHint,
}

BrandBarItem.defaultProps = { orderHint: 'low' }

BrandBarUserMenu.propTypes = {
  label: PropTypes.node.isRequired,
  isProfilePage: PropTypes.bool,
}

BrandBarUserMenu.defaultProps = {
  isProfilePage: false,
}

export default BrandBar

const ActionBarUserMenu: React.FC<UserMenuProps> = ({
  label,
  children,
  isProfilePage,
  id,
  ...rest
}) => {
  const { buttonProps, toggle, popupProps, wrapperProps } = usePopup('menu', {
    id,
    focusControl,
    onWrapperKeyDown: handleArrows,
  })

  const buttonId = buttonProps.id
  popupProps.onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement
      if (target.matches('[role="menuitem"], [role="menuitem"] *')) {
        toggle(false, document.getElementById(buttonId as string))
      }
    },
    [toggle, buttonId]
  )

  const button = (
    <ActionBar.PanelWrapper key="cactus-user-menu" {...wrapperProps}>
      <ActionMenuButton $isProfilePage={isProfilePage} {...buttonProps} {...rest}>
        <DescriptiveProfile />
      </ActionMenuButton>
      <ActionBar.PanelPopup as={ActionMenuPopup} {...popupProps}>
        <PopupHeader>
          <DescriptiveProfile mr="8px" />
          {label}
        </PopupHeader>
        <ActionMenuList>{children}</ActionMenuList>
      </ActionBar.PanelPopup>
    </ActionBar.PanelWrapper>
  )
  const renderButton = useAction(button, 1000)
  return renderButton && <Sidebar layoutRole="brandbar">{renderButton}</Sidebar>
}

const focusControl = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]'))

const handleArrows = (event: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) => {
  if (event.key === 'ArrowDown') {
    toggle(true, 1, { shift: true })
  } else if (event.key === 'ArrowUp') {
    toggle(true, -1, { shift: true })
  }
}

const positionPopup = (menu: HTMLElement, menuButton: HTMLElement | null) => {
  if (menuButton) {
    const parent = menuButton.offsetParent || getViewport()
    const viewWidth = parent?.getBoundingClientRect().right || window.innerWidth
    const { right, width, bottom } = menuButton.getBoundingClientRect()
    menu.style.top = `${bottom}px`
    menu.style.right = `${viewWidth - right}px`
    menu.style.minWidth = `${width}px`
    menu.style.maxWidth = '400px'
  }
}

const UserMenu: React.FC<UserMenuProps> = ({ id, label, children, isProfilePage, ...rest }) => {
  const { expanded, buttonProps, toggle, popupProps, wrapperProps } = usePopup('menu', {
    id,
    focusControl,
    onWrapperKeyDown: handleArrows,
  })
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  usePositioning({
    position: positionPopup,
    visible: expanded,
    ref: listRef,
    anchorRef: buttonRef,
    updateOnScroll: true,
  })
  popupProps.onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement
      if (target.matches('[role="menuitem"], [role="menuitem"] *')) {
        toggle(false, buttonRef.current)
      }
    },
    [toggle]
  )
  return (
    <StyledUserMenu {...wrapperProps}>
      <MenuButton {...buttonProps} {...rest} ref={buttonRef}>
        <DescriptiveProfile aria-hidden mr="8px" />
        <span>{label}</span>
        <NavigationChevronDown aria-hidden ml="8px" />
      </MenuButton>
      <MenuList {...popupProps} ref={listRef}>
        {children}
      </MenuList>
    </StyledUserMenu>
  )
}

const StyledUserMenu = styled.div`
  outline: none;
`

const StyledBrandBar = styled.div<{ $isTiny: boolean }>`
  display: flex;
  ${(p) =>
    p.$isTiny
      ? `
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  `
      : `
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  `}
  width: 100%;
  ${(p): string => insetBorder(p.theme, 'lightContrast', 'bottom')};
`
const LogoWrapper = styled.div`
  padding: 16px;
  &,
  * {
    display: block;
    max-width: 200px;
    max-height: 80px;
  }
`

const MenuButton = styled.button<ProfileStyleProp>`
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 600;
  margin-right: 5px;
  background-color: transparent;
  border: 0;
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  margin: 0;
  border-radius: 0;
  ${(p) =>
    p.$isProfilePage &&
    `
    color: ${p.theme.colors.callToAction};
    ${insetBorder(p.theme, 'callToAction', 'bottom')};
  `}
  &:focus {
    ${(p) => insetBorder(p.theme, 'callToAction')};
    outline: none;
  }
  &[aria-expanded='true'] {
    ${(p) => insetBorder(p.theme, 'callToAction', 'bottom')};
    color: ${(p): string => p.theme.colors.callToAction};
    ${NavigationChevronDown} {
      transform: scaleY(-1);
    }
  }
  &:hover {
    color: ${(p): string => p.theme.colors.callToAction};
  }
  & svg {
    font-size: 12px;
  }
`

const MenuList = styled.ul`
  display: block;
  position: fixed;
  outline: none;
  z-index: 110;
  &[aria-hidden] {
    display: none;
  }
  padding: 8px 0;
  margin-top: 8px;
  border-radius: ${radius(8)};
  ${(p) => boxShadow(p.theme, 1) || `border: ${border(p.theme, 'lightContrast')}`};
  background-color: ${(p) => p.theme.colors.white};
  list-style: none;
  [role='menuitem'] {
    box-sizing: border-box;
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    word-wrap: break-word;
    overflow-wrap: break-word;
    ${(p) => textStyle(p.theme, 'small')};
    ${(p) => p.theme.colorStyles.standard};
    outline: none;
    padding: 4px 16px;
    text-align: center;
    &:focus {
      background-color: ${(p) => p.theme.colors.lightContrast};
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }
  }
`

const ActionMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  outline: none;
  word-wrap: break-word;
  overflow-wrap: break-word;
  [role='menuitem'] {
    &:focus {
      background-color: ${(p) => p.theme.colors.lightContrast};
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:visited {
      color: inherit;
      &:hover {
        color: ${(p) => p.theme.colors.callToAction};
      }
    }
  }
`

const ActionMenuButton = styled(ActionBar.Button)<ProfileStyleProp>(
  (p) => p.$isProfilePage && `color: ${p.theme.colors.callToAction};`
)

const PopupHeader = styled.div`
  text-align: right;
  box-sizing: border-box;
  display: block;
  word-wrap: break-word;
  overflow-wrap: break-word;
  padding: 18px 16px;
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 600;
  color: ${(p) => p.theme.colors.callToAction};
  ${(p) => insetBorder(p.theme, 'callToAction', 'bottom')};
  svg {
    font-size: 12px;
  }
`
