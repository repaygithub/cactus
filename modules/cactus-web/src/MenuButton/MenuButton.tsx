import { margin, MarginProps } from 'styled-system'
import { NavigationChevronDown } from '@repay/cactus-icons'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import {
  Menu as ReachMenu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuLink as ReachMenuLink,
  MenuList as ReachMenuList,
} from '@reach/menu-button'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { createGlobalStyle, StyledComponent } from 'styled-components'

const MenuButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }

  [data-reach-menu] {
    display: block;
    position: absolute;
  }
`

const MenuList = styled(ReachMenuList)`
  padding: 8px 0;
  margin-top: 8px;
  border-radius: 0 0 8px 8px;
  background-color: ${p => p.theme.colors.white};
  box-shadow: 0 3px 6px 0 ${p => p.theme.colors.callToAction};
  outline: none;

  [data-reach-menu-item] {
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    ${p => p.theme.textStyles.small};
    color: ${p => p.theme.colors.darkestContrast};
    outline: none;
    padding: 4px 16px;
    text-align: center;

    &:focus {
      background-color: ${p => p.theme.colors.callToAction};
      color: ${p => p.theme.colors.callToActionText};
    }
  }
`

interface MenuButtonProps extends MarginProps {
  label: React.ReactNode
  className?: string
  /**
   * Must be a MenuButton.Item or MenuButton.Link
   */
  children: React.ReactNode
  disabled?: boolean
}

function MenuButtonBase(props: MenuButtonProps) {
  const { label, children, ...rest } = omitMargins(props) as Omit<
    MenuButtonProps,
    keyof MarginProps
  >
  return (
    <ReachMenu>
      <MenuButtonStyles />
      <ReachMenuButton {...rest}>
        {label}
        <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
      </ReachMenuButton>
      <MenuList>{children}</MenuList>
    </ReachMenu>
  )
}

MenuButtonBase.Item = ReachMenuItem
MenuButtonBase.Link = ReachMenuLink

type MenuButtonType = StyledComponent<typeof MenuButtonBase, any, {}, never> & {
  Item: typeof MenuButtonBase['Item']
  Link: typeof MenuButtonBase['Link']
}

const MenuButton = styled(MenuButtonBase)`
  position: relative;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 2px 24px 2px 14px;
  border: 2px solid;
  outline: none;
  cursor: pointer;
  appearance: none;
  ${p => p.theme.textStyles.body};
  color: ${p => p.theme.colors.baseText};
  background-color: ${p => p.theme.colors.darkContrast};
  border-color: ${p => p.theme.colors.darkContrast};

  &:hover,
  &[aria-expanded='true'] {
    background-color: ${p => p.theme.colors.callToAction};
    border-color: ${p => p.theme.colors.callToAction};
  }

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus {
    ::after {
      content: '';
      display: block;
      position: absolute;
      height: calc(100% + 10px);
      width: calc(100% + 11px);
      top: -5px;
      left: -5px;
      border: 2px solid ${p => p.theme.colors.callToAction};
      border-radius: 20px;
      box-sizing: border-box;
    }
  }

  &:disabled {
    color: ${p => p.theme.colors.mediumGray};
    background-color: ${p => p.theme.colors.lightGray};
    border-color: ${p => p.theme.colors.lightGray};
    cursor: not-allowed;
  }

  &[aria-expanded='true'] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
  }

  ${NavigationChevronDown} {
    position: absolute;
    right: 10px; // 8 + 2px from border
    top: 12px;
  }

  ${margin}
` as MenuButtonType

MenuButton.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
}

export { MenuButton }

export default MenuButton
