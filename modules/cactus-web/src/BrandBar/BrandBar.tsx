import { DescriptiveProfile, NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { ActionBar } from '../ActionBar/ActionBar'
import { OrderHint, useAction } from '../ActionBar/ActionProvider'
import Flex from '../Flex/Flex'
import FocusLock from '../FocusLock/FocusLock'
import { keyDownAsClick } from '../helpers/a11y'
import { PolyFC } from '../helpers/asProps'
import { getTopPosition, getViewport, usePositioning } from '../helpers/positionPopover'
import { classes } from '../helpers/styled'
import {
  border,
  boxShadow,
  insetBorder,
  popupBoxShadow,
  popupShape,
  radius,
  textStyle,
} from '../helpers/theme'
import usePopup, { TogglePopup } from '../helpers/usePopup'
import { useLayout } from '../Layout/Layout'
import { Sidebar } from '../Layout/Sidebar'
import { MenuItemFunc, MenuItemType } from '../MenuItem/MenuItem'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'
import { SidebarMenu as ActionMenuPopup } from '../SidebarMenu/SidebarMenu'

interface ItemProps {
  id?: string
  mobileIcon?: React.ReactElement
  orderHint?: OrderHint
  align?: Align
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

type Align = 'left' | 'right'

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  listItemSelector?: string
}

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  buttonRef: React.RefObject<HTMLButtonElement>
  popupRef: React.RefObject<HTMLDivElement>
  isOpen: boolean
  $isTiny: boolean
}

// Margin between BrandBar dropdowns and the BrandBar itself.
const DROPDOWN_MARGIN = 8

// Tell Typescript to treat this as a regular functional component,
// even though React knows it's a `forwardRef` component.
const MenuItemFR = React.forwardRef(MenuItemFunc) as any
const MenuItem = MenuItemFR as MenuItemType

export const BrandBarDropdown: React.FC<DropdownProps> = (props) => {
  return <Dropdown {...props} />
}

export const BrandBarUserMenu: React.FC<UserMenuProps> = (props) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const actionButton = isTiny ? <ActionBarUserMenu {...props} /> : null
  const renderButton = useAction(actionButton, 1000, 'cactus-user-menu')
  if (!isTiny) {
    return <UserMenu {...props} />
  }
  return renderButton && <Sidebar layoutRole="brandbar-menu">{renderButton}</Sidebar>
}

export const BrandBarItem: PolyFC<ItemProps, 'div'> = (props) => {
  const { mobileIcon, as: Component, ...rest } = props
  const isTiny = SIZES.tiny === useScreenSize()
  if (isTiny && mobileIcon) {
    return <ActionBar.Panel aria-label="" {...rest} icon={mobileIcon} />
  } else if (Component) {
    return <Component {...(rest as any)} />
  }
  return <>{props.children}</>
}

type BrandBarType = React.FC<BrandBarProps> & {
  Item: typeof BrandBarItem
  UserMenu: typeof BrandBarUserMenu
  UserMenuItem: typeof MenuItem
  Dropdown: typeof BrandBarDropdown
}

export const BrandBar: BrandBarType = ({ logo, children, className, ...props }) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const justify = isTiny ? 'center' : 'flex-end'
  const childrenArray = React.Children.toArray(children)
  const alignedChildren = childrenArray.filter(
    (child) => (child as JSX.Element).props.align !== undefined
  )
  const leftChildren = alignedChildren.filter(
    (child) => (child as JSX.Element).props.align === 'left'
  )
  const rightChildren = alignedChildren.filter(
    (child) => (child as JSX.Element).props.align === 'right'
  )
  const nonAlignedChildren = childrenArray.filter(
    (child) => (child as JSX.Element).props.align === undefined
  )

  const layoutClass = useLayout('brandbar', { grid: 'header' })
  return (
    <StyledBrandBar {...props} className={classes(className, layoutClass)} $isTiny={isTiny}>
      <Flex justifyContent={justify} flexWrap="nowrap">
        <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
        {!isTiny && leftChildren}
      </Flex>
      {isTiny ? (
        <Flex flexDirection="column" width="100%">
          {(!!leftChildren.length || !!rightChildren.length) && (
            <StyledDropdownRow
              alignItems="flex-end"
              justifyContent="center"
              flexWrap="nowrap"
              width="100%"
            >
              {leftChildren}
              {rightChildren}
            </StyledDropdownRow>
          )}
          <Flex alignItems="flex-end" justifyContent={justify}>
            {nonAlignedChildren}
          </Flex>
        </Flex>
      ) : (
        <Flex justifyContent={justify} flexWrap="nowrap">
          {childrenArray.filter((child) => (child as JSX.Element).props.align !== 'left')}
        </Flex>
      )}
    </StyledBrandBar>
  )
}

BrandBar.displayName = 'BrandBar'
BrandBar.Item = BrandBarItem
BrandBar.UserMenu = BrandBarUserMenu
BrandBar.UserMenuItem = MenuItem
BrandBar.Dropdown = BrandBarDropdown

BrandBar.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

BrandBarItem.propTypes = {
  mobileIcon: PropTypes.element,
  orderHint: ActionBar.Panel.propTypes?.orderHint,
  align: PropTypes.oneOf(['left', 'right']),
}

BrandBarItem.defaultProps = { orderHint: 'low' }

BrandBarUserMenu.propTypes = {
  label: PropTypes.node.isRequired,
  isProfilePage: PropTypes.bool,
}

BrandBarUserMenu.defaultProps = {
  isProfilePage: false,
}

BrandBarDropdown.propTypes = {
  label: PropTypes.node.isRequired,
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

  return (
    <ActionBar.PanelWrapper {...wrapperProps}>
      <ActionMenuButton $isProfilePage={isProfilePage} {...buttonProps} {...rest}>
        <DescriptiveProfile />
      </ActionMenuButton>
      <ActionBar.PanelPopup as={ActionMenuPopup} padding="0" {...popupProps}>
        <PopupHeader>
          <DescriptiveProfile mr="8px" />
          {label}
        </PopupHeader>
        <ActionMenuList>{children}</ActionMenuList>
      </ActionBar.PanelPopup>
    </ActionBar.PanelWrapper>
  )
}

const focusControl = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]'))

const handleArrows = (event: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) => {
  const key = event.key
  if (key === 'ArrowDown') {
    event.preventDefault()
    toggle(true, 1, { shift: true })
  } else if (key === 'ArrowUp') {
    event.preventDefault()
    toggle(true, -1, { shift: true })
  } else if (key === 'End') {
    event.preventDefault()
    toggle(true, -1)
  } else if (key === 'Home') {
    event.preventDefault()
    toggle(true, 0)
  }
}

const positionPopup = (menu: HTMLElement, menuButton: HTMLElement | null) => {
  if (menuButton) {
    const parent = menuButton.offsetParent || getViewport()
    const viewWidth = parent?.getBoundingClientRect().right || window.innerWidth
    const { right, width, bottom, top } = menuButton.getBoundingClientRect()
    const availableBelow = window.innerHeight - bottom
    menu.style.top = `${bottom}px`
    menu.style.right = `${viewWidth - right}px`
    menu.style.minWidth = `${width}px`
    menu.style.maxWidth = '400px'
    menu.style.maxHeight = `${Math.max(availableBelow, top) - DROPDOWN_MARGIN}px`
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

const Dropdown: React.FC<DropdownProps> = ({
  label,
  children,
  listItemSelector = '[role="menuitem"], [role="menuitem"] *',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const portalRef = React.useRef<HTMLDivElement>(null)
  const isTiny = SIZES.tiny === useScreenSize()
  const { expanded, toggle, buttonProps, popupProps, wrapperProps, setFocus } = usePopup('dialog', {
    onWrapperKeyDown: handleArrows,
  })

  const handlePopupKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key
    if (key === 'Enter' || key === ' ') {
      keyDownAsClick(event)
    }
    switch (key) {
      case 'Home':
        setFocus(0)
        break
      case 'End':
        setFocus(-1)
        break
      case 'Escape':
        toggle(false, buttonRef.current)
        break
    }
  }

  const handlePopupClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement
      if (target.matches(listItemSelector)) {
        toggle(false, buttonRef.current)
      }
    },
    [toggle, listItemSelector]
  )

  return (
    <div {...wrapperProps}>
      <DropdownButton $isTiny={isTiny} ref={buttonRef} {...buttonProps}>
        <span>{label}</span>
        <NavigationChevronDown aria-hidden ml={4} />
      </DropdownButton>
      <DropdownPopup
        buttonRef={buttonRef}
        popupRef={portalRef}
        isOpen={expanded}
        $isTiny={isTiny}
        {...popupProps}
        onKeyDown={handlePopupKeyDown}
        onClick={handlePopupClick}
      >
        {children}
      </DropdownPopup>
    </div>
  )
}

const BasePopup: React.FC<PopupProps> = ({ buttonRef, popupRef, isOpen, ...props }) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const positionPortal = React.useCallback<
    (popover: HTMLElement, target: HTMLElement | null) => void
  >(
    (popover, target) => {
      if (!target || !popover) {
        return
      }
      const targetRect = target.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const buttonWidth = targetRect.width
      const availableBelow = window.innerHeight - targetRect.bottom

      const topPosition = getTopPosition(targetRect, popoverRect)
      popover.style.top = topPosition.top
      popover.style.left = isTiny ? '0px' : `${targetRect.left}px`
      popover.style.minWidth = `${buttonWidth}px`
      popover.style.maxHeight = `${Math.max(availableBelow, targetRect.top) - DROPDOWN_MARGIN}px`
      if (isTiny) {
        popover.style.right = '0px'
      } else {
        popover.style.maxWidth = `${window.innerWidth - targetRect.left}px`
      }
    },
    [isTiny]
  )
  usePositioning({
    anchorRef: buttonRef,
    ref: popupRef,
    visible: isOpen,
    position: positionPortal,
    updateOnScroll: true,
  })
  return <FocusLock ref={popupRef} {...props} />
}

const StyledDropdownRow = styled(Flex)`
  border-top: ${(p) => border(p.theme, 'lightContrast')};
  border-bottom: ${(p) => border(p.theme, 'lightContrast')};
`

const DropdownButton = styled.button<{ $isTiny: boolean }>`
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 600;
  margin: 0;
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  background-color: transparent;
  ${(p) => textStyle(p.theme, 'body')};
  padding: ${(p) => p.theme.space[4]}px;
  border: 0;
  border-left: ${(p) => border(p.theme, 'lightContrast')};
  border-right: ${(p) => border(p.theme, 'lightContrast')};
  outline: none;

  &[aria-expanded='true'] {
    color: ${(p) => p.theme.colors.callToAction};

    ${NavigationChevronDown} {
      transform: scaleY(-1);
    }
  }

  &:focus {
    ${(p) => !p.$isTiny && insetBorder(p.theme, 'callToAction')};
    color: ${(p) => p.theme.colors.callToAction};
  }

  &:hover {
    color: ${(p) => p.theme.colors.callToAction};
  }

  & svg {
    font-size: 12px;
  }
`

const DropdownPopup = styled(BasePopup)`
  display: block;
  &[aria-hidden='true'] {
    display: none;
  }
  box-sizing: border-box;
  position: fixed;
  z-index: 1000;
  overflow-y: auto;
  outline: none;
  margin-top: ${DROPDOWN_MARGIN}px;
  background-color: ${(p): string => p.theme.colors.white};
  ${(p) => popupShape('menu', p.theme.shape)}
  ${(p) => popupBoxShadow(p.theme)}
  outline: none;
  ${(p) => p.$isTiny && 'width: 100%;'}
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
    align-items: stretch;
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
    max-height: 60px;
  }
`

const MenuButton = styled.button<ProfileStyleProp>`
  ${(p) => textStyle(p.theme, 'body')};
  height: 100%;
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
  box-sizing: border-box;
  position: fixed;
  outline: none;
  z-index: 110;
  overflow-y: auto;
  &[aria-hidden] {
    display: none;
  }
  padding: 8px 0;
  margin-top: ${DROPDOWN_MARGIN}px;
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
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
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
