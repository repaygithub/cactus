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
import { useAction } from '../ActionBar/ActionProvider'
import { getTopPosition } from '../helpers/positionPopover'
import { border, boxShadow, insetBorder, radius, textStyle } from '../helpers/theme'
import { Sidebar } from '../Layout/Sidebar'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'

interface UserMenuProps {
  userMenuText: string
  isProfilePage?: boolean
}

interface ProfileStyleProp {
  $isProfilePage?: boolean
}

interface BrandBarProps extends UserMenuProps, React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
}
interface MenuItemProps {
  children?: React.ReactNode
  onSelect: () => any
}

const MenuButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`

const MenuItem = (props: MenuItemProps) => {
  const { children, onSelect } = props
  return <ReachMenuItem onSelect={onSelect}>{children}</ReachMenuItem>
}

type BrandBarType = React.FC<BrandBarProps> & { UserMenuItem: typeof MenuItem }

const BrandBar: BrandBarType = ({ logo, userMenuText, isProfilePage, children, ...props }) => {
  const menuProps = { userMenuText, isProfilePage, children }
  const isTiny = SIZES.tiny === React.useContext(ScreenSizeContext)
  const MenuComponent = isTiny ? ActionBarUserMenu : UserMenu

  return (
    <StyledBrandBar {...props} isTiny={isTiny}>
      <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      <MenuButtonStyles />
      <MenuComponent {...menuProps} />
    </StyledBrandBar>
  )
}

BrandBar.UserMenuItem = MenuItem

BrandBar.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  userMenuText: PropTypes.string.isRequired,
  isProfilePage: PropTypes.bool,
}

BrandBar.defaultProps = {
  isProfilePage: false,
}

export default BrandBar

const ActionBarUserMenu: React.FC<UserMenuProps> = ({ userMenuText, children, isProfilePage }) => {
  const button = (
    <ActionBar.PanelWrapper key="cactus-user-menu">
      <Menu>
        <ActionMenuButton as={ReachMenuButton as any} $isProfilePage={isProfilePage}>
          <DescriptiveProfile />
          <VisuallyHidden>{userMenuText}</VisuallyHidden>
        </ActionMenuButton>
        <ActionBar.PanelPopup as={ActionMenuPopup} portal={false}>
          <PopupHeader aria-hidden>
            <DescriptiveProfile mr="8px" />
            {userMenuText}
          </PopupHeader>
          <ActionMenuList>{children}</ActionMenuList>
        </ActionBar.PanelPopup>
      </Menu>
    </ActionBar.PanelWrapper>
  )
  const renderButton = useAction(button, 1000)
  return renderButton && <Sidebar layoutRole="brandbar">{renderButton}</Sidebar>
}

const UserMenu: React.FC<UserMenuProps> = ({ userMenuText, children, isProfilePage }) => {
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
      <MenuButton $isProfilePage={isProfilePage} ref={buttonRef}>
        <DescriptiveProfile aria-hidden mr="8px" />
        <span>{userMenuText}</span>
        <NavigationChevronDown aria-hidden ml="8px" />
      </MenuButton>
      <MenuPopover position={position}>
        <MenuList>{children}</MenuList>
      </MenuPopover>
    </Menu>
  )
}

const StyledBrandBar = styled.div<{ isTiny: boolean }>`
  display: flex;
  justify-content: ${(p) => (p.isTiny ? 'center' : 'space-between')};
  align-items: flex-end;
  width: 100%;
  ${(p): string => insetBorder(p.theme, 'lightContrast', 'bottom')};
`
const LogoWrapper = styled.div`
  padding: 16px;
  max-width: 200px;
  max-height: 80px;
  display: flex;
  & > * {
    flex-shrink: 0;
    max-width: 100%;
    max-height: 100%;
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
  border-radius: ${radius};
  ${(p) => boxShadow(p.theme, 1) || `border: ${border(p.theme, 'lightContrast')}`};
  background-color: ${(p) => p.theme.colors.white};

  [data-reach-menu-item] {
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
