import React from 'react'

import { BorderSize, Shape } from '@repay/cactus-theme'
import { boxShadow, textStyle } from '../helpers/theme'
import { CactusTheme } from '@repay/cactus-theme'
import { getScrollX } from '../helpers/scrollOffset'
import { getTopPosition } from '../helpers/positionPopover'
import { margin, MarginProps } from 'styled-system'
import { NavigationChevronDown } from '@repay/cactus-icons'
import { Omit } from '../types'
import { omitMargins } from '../helpers/omit'
import {
  Menu as ReachMenu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItems as ReachMenuItems,
  MenuLink as ReachMenuLink,
  MenuPopover as ReachMenuPopover,
} from '@reach/menu-button'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle, css, StyledComponent } from 'styled-components'

const borderMap = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const shapeMap = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 8px;
  `,
  round: css`
    border-radius: 20px;
  `,
}

const dropShapeMap = {
  square: css`
    border-radius: 0 0 1px 1px;
  `,
  intermediate: css`
    border-radius: 0 0 4px 4px;
  `,
  round: css`
    border-radius: 0 0 8px 8px;
  `,
}

const getShape = (shape: Shape) => shapeMap[shape]

const getBorder = (size: BorderSize) => borderMap[size]

const getDropShape = (shape: Shape) => dropShapeMap[shape]

const getDropDownBorder = (theme: CactusTheme) => {
  if (!theme.boxShadows) {
    return css`
      ${getBorder(theme.border)};
      border-color: ${theme.colors.lightContrast};
      ${getDropShape(theme.shape)};
    `
  } else {
    return css`
      ${getDropShape(theme.shape)};
    `
  }
}

const MenuButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`

const MenuList = styled(ReachMenuItems)`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  ${(p) => getDropDownBorder(p.theme)};
  ${(p) => boxShadow(p.theme, 1)};
  background-color: ${(p) => p.theme.colors.white};

  [data-reach-menu-item] {
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
      <ReachMenuPopover
        position={(targetRect, popoverRect) => {
          if (!targetRect || !popoverRect) {
            return {}
          }

          const scrollX = getScrollX()

          return {
            width: targetRect.width,
            left: targetRect.left + scrollX,
            ...getTopPosition(targetRect, popoverRect),
          }
        }}
      >
        <MenuList>{children}</MenuList>
      </ReachMenuPopover>
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
  ${(p) => getShape(p.theme.shape)};
  ${(p) => getBorder(p.theme.border)};
  padding: 2px 24px 2px 14px;
  outline: none;
  cursor: pointer;
  appearance: none;
  ${(p) => textStyle(p.theme, 'body')};
  color: ${(p) => p.theme.colors.white};
  background-color: ${(p) => p.theme.colors.darkContrast};
  border-color: ${(p) => p.theme.colors.darkContrast};

  &:hover,
  &[aria-expanded='true'] {
    background-color: ${(p) => p.theme.colors.callToAction};
    border-color: ${(p) => p.theme.colors.callToAction};
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
      box-sizing: border-box;
      ${(p) => getShape(p.theme.shape)};
      ${(p) => getBorder(p.theme.border)};
      border-color: ${(p) => p.theme.colors.callToAction};
    }
  }

  &:disabled {
    color: ${(p) => p.theme.colors.mediumGray};
    background-color: ${(p) => p.theme.colors.lightGray};
    border-color: ${(p) => p.theme.colors.lightGray};
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
