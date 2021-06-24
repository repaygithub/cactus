import {
  Menu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItems as ReachMenuList,
  MenuPopover,
} from '@reach/menu-button'
import { Position } from '@reach/popover'
import VisuallyHidden from '@reach/visually-hidden'
import { DescriptiveProfile, NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import { ActionBar } from '../ActionBar/ActionBar'
import { OrderHint, useAction } from '../ActionBar/ActionProvider'
import Flex from '../Flex/Flex'
import FocusLock from '../FocusLock/FocusLock'
import { keyDownAsClick } from '../helpers/a11y'
import { PolyFC } from '../helpers/asProps'
import { getTopPosition } from '../helpers/positionPopover'
import { usePositioning } from '../helpers/positionPopover'
import {
  border,
  boxShadow,
  insetBorder,
  popupBoxShadow,
  popupShape,
  radius,
  textStyle,
} from '../helpers/theme'
import usePopup from '../helpers/usePopup'
import { Sidebar } from '../Layout/Sidebar'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

interface ItemProps {
  id?: string
  mobileIcon?: React.ReactElement
  orderHint?: OrderHint
  align?: Align
}

interface UserMenuProps {
  label: React.ReactNode
  isProfilePage?: boolean
}

interface ProfileStyleProp {
  $isProfilePage?: boolean
}

interface BrandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
}
interface MenuItemProps {
  children: React.ReactNode
  onSelect: () => any
}

type Align = 'left' | 'right'

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  align: Align
}

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  buttonRef: React.RefObject<HTMLButtonElement>
  popupRef: React.RefObject<HTMLDivElement>
  isOpen: boolean
  align: Align
  $isTiny: boolean
}

const MenuButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`

export const BrandBarDropdown: React.FC<DropdownProps> = (props) => {
  return <Dropdown {...props} />
}

const MenuItem = (props: MenuItemProps) => {
  // @ts-ignore Setting `id` screws up Reach internals...so why do they even allow it?
  const { id, ...rest } = props
  return <ReachMenuItem {...rest} />
}

export const BrandBarUserMenu: React.FC<UserMenuProps> = (props) => {
  const isTiny = SIZES.tiny === useScreenSize()
  const MenuComponent = isTiny ? ActionBarUserMenu : UserMenu
  return <MenuComponent {...props} />
}

export const BrandBarItem: PolyFC<ItemProps, 'div'> = (props) => {
  const { mobileIcon, ...rest } = props
  const isTiny = SIZES.tiny === useScreenSize()
  if (isTiny && mobileIcon) {
    return <ActionBar.Panel aria-label="" {...rest} icon={mobileIcon} />
  } else if ((rest as any).align && rest.as) {
    return <BrandBarDropdown {...(rest as any)} />
  }
  return <>{props.children}</>
}

type BrandBarType = React.FC<BrandBarProps> & {
  Item: typeof BrandBarItem
  UserMenu: typeof BrandBarUserMenu
  UserMenuItem: typeof MenuItem
  Dropdown: typeof BrandBarDropdown
}

export const BrandBar: BrandBarType = ({ logo, children, ...props }) => {
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

  return (
    <StyledBrandBar {...props} $isTiny={isTiny}>
      <Flex alignItems="flex-end" justifyContent={justify}>
        <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
        {!isTiny && leftChildren}
      </Flex>
      <MenuButtonStyles />
      {isTiny ? (
        <Flex flexDirection="column" width="100%">
          <StyledDropdownRow
            alignItems="flex-end"
            justifyContent={
              leftChildren.length && !rightChildren.length
                ? 'flex-start'
                : rightChildren.length && !leftChildren.length
                ? 'flex-end'
                : 'space-between'
            }
            flexWrap="nowrap"
            width="100%"
          >
            {leftChildren}
            {rightChildren}
          </StyledDropdownRow>
          <Flex alignItems="flex-end" justifyContent={justify}>
            {nonAlignedChildren}
          </Flex>
        </Flex>
      ) : (
        <Flex alignItems="flex-end" justifyContent={justify}>
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

BrandBarItem.defaultProps = { orderHint: 'low', align: 'right' }

BrandBarUserMenu.propTypes = {
  label: PropTypes.node.isRequired,
  isProfilePage: PropTypes.bool,
}

BrandBarUserMenu.defaultProps = {
  isProfilePage: false,
}

BrandBarDropdown.propTypes = {
  label: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'right'] as Align[]).isRequired,
}

export default BrandBar

const ActionBarUserMenu: React.FC<UserMenuProps> = ({
  label,
  children,
  isProfilePage,
  ...rest
}) => {
  const button = (
    <ActionBar.PanelWrapper key="cactus-user-menu">
      <Menu>
        <ActionMenuButton as={ReachMenuButton as any} $isProfilePage={isProfilePage} {...rest}>
          <DescriptiveProfile />
          <VisuallyHidden>{label}</VisuallyHidden>
        </ActionMenuButton>
        <ActionBar.PanelPopup as={ActionMenuPopup} portal={false}>
          <PopupHeader aria-hidden>
            <DescriptiveProfile mr="8px" />
            {label}
          </PopupHeader>
          <ActionMenuList>{children}</ActionMenuList>
        </ActionBar.PanelPopup>
      </Menu>
    </ActionBar.PanelWrapper>
  )
  const renderButton = useAction(button, 1000)
  return renderButton && <Sidebar layoutRole="brandbar">{renderButton}</Sidebar>
}

const UserMenu: React.FC<UserMenuProps> = ({ label, children, isProfilePage, ...rest }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const position = React.useCallback<Position>(
    (targetRect, popoverRect) => {
      if (!targetRect || !popoverRect || !buttonRef.current) {
        return {}
      }
      const buttonWidth = buttonRef.current.clientWidth

      return {
        minWidth: targetRect.width + 21,
        maxWidth: Math.max(buttonWidth, Math.min(buttonWidth * 2, 400)),
        right: targetRect.right,
        left: targetRect.left - 21,
        ...getTopPosition(targetRect, popoverRect),
      }
    },
    [buttonRef]
  )
  return (
    <Menu>
      <MenuButton $isProfilePage={isProfilePage} ref={buttonRef} {...rest}>
        <DescriptiveProfile aria-hidden mr="8px" />
        <span>{label}</span>
        <NavigationChevronDown aria-hidden ml="8px" />
      </MenuButton>
      <MenuPopover position={position}>
        <MenuList>{children}</MenuList>
      </MenuPopover>
    </Menu>
  )
}

const Dropdown: React.FC<DropdownProps> = ({ label, children, align }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const portalRef = React.useRef<HTMLDivElement>(null)
  const isTiny = SIZES.tiny === useScreenSize()
  const { expanded, toggle, buttonProps, popupProps, setFocus } = usePopup('dialog', {})

  React.useEffect(() => {
    const handleBodyClick = (event: MouseEvent): void => {
      const { target } = event
      if (
        target instanceof Node &&
        !buttonRef.current?.contains(target) &&
        !portalRef.current?.contains(target)
      ) {
        toggle(false)
      }
    }

    const handleBodyKeyDown = (event: KeyboardEvent) => {
      const { target } = event
      if (
        target instanceof Node &&
        !buttonRef.current?.contains(target) &&
        !portalRef.current?.contains(target)
      ) {
        toggle(false)
      }
    }

    document.body.addEventListener('click', handleBodyClick)
    document.body.addEventListener('keydown', handleBodyKeyDown)

    return () => {
      document.body.removeEventListener('click', handleBodyClick)
      document.body.removeEventListener('keydown', handleBodyKeyDown)
    }
  })

  const handlePopupKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key
    if (key === 'Enter' || key === 'Space') {
      keyDownAsClick(event)
    }
    switch (key) {
      case 'ArrowDown':
        setFocus(1, { shift: true })
        break
      case 'ArrowUp':
        setFocus(-1, { shift: true })
        break
      case 'Home':
        setFocus(0)
        break
      case 'End':
        setFocus(-1)
        break
      case 'Escape':
      case 'Enter':
      case 'Space':
        toggle(false)
        buttonRef.current?.focus()
        break
    }
  }

  const handleTriggerClick = () => {
    toggle()
  }

  return (
    <>
      <DropdownButton
        $isTiny={isTiny}
        ref={buttonRef}
        onClick={handleTriggerClick}
        {...buttonProps}
      >
        <span>{label}</span>
        <NavigationChevronDown aria-hidden ml={4} />
      </DropdownButton>
      <DropdownPopup
        buttonRef={buttonRef}
        popupRef={portalRef}
        isOpen={expanded}
        align={align}
        $isTiny={isTiny}
        {...popupProps}
        onKeyDown={handlePopupKeyDown}
      >
        {children}
      </DropdownPopup>
    </>
  )
}

const BasePopup: React.FC<PopupProps> = ({ buttonRef, popupRef, isOpen, align, ...props }) => {
  const positionPortal = React.useCallback<
    (popover: HTMLElement, target: HTMLElement | null) => void
  >(
    (popover, target) => {
      if (!target || !popover || !buttonRef.current) {
        return
      }
      const targetRect = target.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const buttonWidth = buttonRef.current.clientWidth

      popover.style.minWidth = `${buttonWidth}px`
      if (align === 'right') {
        popover.style.right = `${window.innerWidth - targetRect.right}px`
      } else {
        popover.style.left = `${targetRect.left}px`
      }
      const topPosition = getTopPosition(targetRect, popoverRect)
      popover.style.top = topPosition.top
    },
    [buttonRef, align]
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
  background-color: transparent;
  ${(p) => textStyle(p.theme, 'body')};
  padding: ${(p) => p.theme.space[4]}px;
  border: 0;
  border-bottom: ${(p) => (p.$isTiny ? '0' : border(p.theme, 'lightContrast'))};
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
    border: ${(p) => !p.$isTiny && border(p.theme, 'callToAction')};
    color: ${(p) => p.theme.colors.callToAction};
  }

  & svg {
    font-size: 12px;
  }
`

const DropdownPopup = styled(BasePopup)`
  display: ${(p) => (p.isOpen ? 'block' : 'none')};
  box-sizing: border-box;
  position: fixed;
  z-index: 1000;
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

const MenuButton = styled(ReachMenuButton)<ProfileStyleProp>`
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

const MenuList = styled(ReachMenuList)`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  border-radius: ${radius(8)};
  ${(p) => boxShadow(p.theme, 1) || `border: ${border(p.theme, 'lightContrast')}`};
  background-color: ${(p) => p.theme.colors.white};

  [data-reach-menu-item] {
    z-index: 110;
    box-sizing: border-box;
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    overflow-wrap: break-word;
    ${(p) => textStyle(p.theme, 'small')};
    ${(p) => p.theme.colorStyles.standard};
    outline: none;
    padding: 4px 16px;
    text-align: center;
    &[data-selected] {
      ${(p) => p.theme.colorStyles.callToAction};
    }
  }
`

const ActionMenuList = styled(ReachMenuList)`
  outline: none;
`

const ActionMenuButton = styled(ActionBar.Button)<ProfileStyleProp>(
  (p) => p.$isProfilePage && `color: ${p.theme.colors.callToAction};`
)

const PopupHeader = styled.div`
  text-align: right;
  box-sizing: border-box;
  display: block;
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

// TODO The MenuBar differentiates between hover & focus, but Reach only has
// one state: data-selected. If we ever get rid of Reach, we should match these
// styles to the ones in MenuBar. (Or maybe just refactor to use the same components.)
const ActionMenuPopup = styled(MenuPopover)`
  ${(p) => textStyle(p.theme, 'small')};
  padding: 0;
  &[hidden] {
    display: none;
  }
  [role='menuitem'] {
    display: block;
    box-sizing: border-box;
    padding: 18px 16px;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    overflow-wrap: break-word;
    outline: none;
    ${(p) => insetBorder(p.theme, 'lightContrast', 'bottom')};
    &[data-selected] {
      color: ${(p) => p.theme.colors.callToAction};
      ${(p) => insetBorder(p.theme, 'callToAction')};
    }
  }
`
