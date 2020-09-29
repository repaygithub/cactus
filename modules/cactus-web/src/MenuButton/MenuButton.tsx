import {
  Menu as ReachMenu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItems as ReachMenuItems,
  MenuItemsProps as ReachMenuItemsProps,
  MenuLink as ReachMenuLink,
  MenuPopover as ReachMenuPopover,
} from '@reach/menu-button'
import { NavigationChevronDown } from '@repay/cactus-icons'
import { CactusTheme, ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { createGlobalStyle, css, StyledComponent } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { getTopPosition } from '../helpers/positionPopover'
import { getScrollX } from '../helpers/scrollOffset'
import { border, boxShadow, textStyle } from '../helpers/theme'

const shapeMap = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px;',
  round: 'border-radius: 20px;',
}

const dropShapeMap = {
  square: 'border-radius: 0 0 1px 1px;',
  intermediate: 'border-radius: 0 0 4px 4px;',
  round: 'border-radius: 0 0 8px 8px;',
}

type ThemeProps = { theme: CactusTheme }

const getShape = ({ theme }: ThemeProps) => shapeMap[theme.shape]

const getDropShape = ({ theme }: ThemeProps) => dropShapeMap[theme.shape]

const getDropDownBorder = ({ theme }: ThemeProps) => {
  if (!theme.boxShadows) {
    return css`
      border: ${border(theme, 'lightContrast')};
      ${getDropShape};
    `
  } else {
    return css(getDropShape)
  }
}

const MenuButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`

const menuListVariants: VariantMap = {
  filled: css`
    border: 0;
    &[data-selected] {
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    }
  `,
  unfilled: css`
    border: ${(p) => border(p.theme, 'white')};
    &[data-selected] {
      border-color: ${(p): string => p.theme.colors.callToAction};
    }

    &:hover {
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    }
  `,
}

interface MenuListProps extends ReachMenuItemsProps {
  variant: MenuButtonVariant
}

const MenuList = styled(ReachMenuItems)<MenuListProps>`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  ${getDropDownBorder};
  ${(p) => boxShadow(p.theme, 1)};
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

    ${(p) => menuListVariants[p.variant]}
  }
`

type MenuButtonVariant = 'filled' | 'unfilled'

interface MenuButtonProps extends MarginProps {
  label: React.ReactNode
  variant?: MenuButtonVariant
  className?: string
  /**
   * Must be a MenuButton.Item or MenuButton.Link
   */
  children: React.ReactNode
  disabled?: boolean
}

function MenuButtonBase(props: MenuButtonProps): React.ReactElement {
  const { label, children, variant = 'filled', ...rest } = omitMargins(props) as Omit<
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
        position={(
          targetRect,
          popoverRect
        ): { minWidth?: number; maxWidth?: number; left?: number; top?: string } => {
          if (!targetRect || !popoverRect) {
            return {}
          }

          const scrollX = getScrollX()

          return {
            minWidth: targetRect.width,
            maxWidth: Math.max(targetRect.width, Math.min(targetRect.width * 2, 400)),
            left: targetRect.left + scrollX,
            ...getTopPosition(targetRect, popoverRect),
          }
        }}
      >
        <MenuList variant={variant}>{children}</MenuList>
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

type VariantMap = { [K in MenuButtonVariant]: ReturnType<typeof css> }

const buttonVariantMap: VariantMap = {
  filled: css`
    color: ${(p): string => p.theme.colors.white};
    background-color: ${(p): string => p.theme.colors.darkContrast};
    border-color: ${(p): string => p.theme.colors.darkContrast};

    &:hover,
    &[aria-expanded='true'] {
      background-color: ${(p): string => p.theme.colors.callToAction};
      border-color: ${(p): string => p.theme.colors.callToAction};
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
        ${getShape};
        border: ${(p) => border(p.theme, 'callToAction')};
      }
    }
  `,
  unfilled: css`
    color: ${(p): string => p.theme.colors.darkContrast};
    background-color: ${(p): string => p.theme.colors.white};
    border-color: ${(p): string => p.theme.colors.white};

    &:hover,
    &[aria-expanded='true'] {
      color: ${(p): string => p.theme.colors.white};
      background-color: ${(p): string => p.theme.colors.base};
      border-color: ${(p): string => p.theme.colors.base};
    }

    &:focus {
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
  `,
}

const MenuButton = styled(MenuButtonBase)`
  position: relative;
  box-sizing: border-box;
  ${getShape};
  border: ${(p) => border(p.theme, '')};
  padding: 2px 24px 2px 14px;
  outline: none;
  cursor: pointer;
  appearance: none;
  overflow: visible;
  ${(p) => textStyle(p.theme, 'body')};
  ${(p) => buttonVariantMap[p.variant || 'filled']}

  &::-moz-focus-inner {
    border: 0;
  }

  &:disabled {
    ${(p): ColorStyle => p.theme.colorStyles.disable};
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
  variant: PropTypes.oneOf(['filled', 'unfilled']),
}

MenuButton.defaultProps = {
  variant: 'filled',
}

export { MenuButton }

export default MenuButton
