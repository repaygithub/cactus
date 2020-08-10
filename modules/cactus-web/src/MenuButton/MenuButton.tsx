import {
  Menu as ReachMenu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItems as ReachMenuItems,
  MenuLink as ReachMenuLink,
  MenuPopover as ReachMenuPopover,
} from '@reach/menu-button'
import { NavigationChevronDown } from '@repay/cactus-icons'
import { BorderSize, Shape } from '@repay/cactus-theme'
import { CactusTheme, ColorStyle, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, {
  createGlobalStyle,
  css,
  FlattenSimpleInterpolation,
  StyledComponent,
} from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { getTopPosition } from '../helpers/positionPopover'
import { getScrollX } from '../helpers/scrollOffset'
import { boxShadow, textStyle } from '../helpers/theme'
import { Omit } from '../types'

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

const getShape = (shape: Shape): FlattenSimpleInterpolation => shapeMap[shape]

const getBorder = (size: BorderSize): FlattenSimpleInterpolation => borderMap[size]

const getDropShape = (shape: Shape): FlattenSimpleInterpolation => dropShapeMap[shape]

const getDropDownBorder = (theme: CactusTheme): FlattenSimpleInterpolation => {
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
  ${(p): FlattenSimpleInterpolation => getDropDownBorder(p.theme)};
  ${(p): string => boxShadow(p.theme, 1)};
  background-color: ${(p): string => p.theme.colors.white};

  [data-reach-menu-item] {
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    overflow-wrap: break-word;
    ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
    ${(p): ColorStyle => p.theme.colorStyles.standard};
    outline: none;
    padding: 4px 16px;
    text-align: center;

    &[data-selected] {
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
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

function MenuButtonBase(props: MenuButtonProps): React.ReactElement {
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
        position={(targetRect, popoverRect): { width?: number; left?: number; top?: string } => {
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

type MenuButtonType = StyledComponent<
  typeof MenuButtonBase,
  any,
  Record<string, unknown>,
  never
> & {
  Item: typeof MenuButtonBase['Item']
  Link: typeof MenuButtonBase['Link']
}

const MenuButton = styled(MenuButtonBase)`
  position: relative;
  box-sizing: border-box;
  ${(p): FlattenSimpleInterpolation => getShape(p.theme.shape)};
  ${(p): FlattenSimpleInterpolation => getBorder(p.theme.border)};
  padding: 2px 24px 2px 14px;
  outline: none;
  cursor: pointer;
  appearance: none;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  color: ${(p): string => p.theme.colors.white};
  background-color: ${(p): string => p.theme.colors.darkContrast};
  border-color: ${(p): string => p.theme.colors.darkContrast};

  &:hover,
  &[aria-expanded='true'] {
    background-color: ${(p): string => p.theme.colors.callToAction};
    border-color: ${(p): string => p.theme.colors.callToAction};
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
      ${(p): FlattenSimpleInterpolation => getShape(p.theme.shape)};
      ${(p): FlattenSimpleInterpolation => getBorder(p.theme.border)};
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
  }

  &:disabled {
    color: ${(p): string => p.theme.colors.mediumGray};
    background-color: ${(p): string => p.theme.colors.lightGray};
    border-color: ${(p): string => p.theme.colors.lightGray};
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
