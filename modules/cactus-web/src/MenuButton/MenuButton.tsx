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
import styled, { createGlobalStyle, css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { extractMargins } from '../helpers/omit'
import { positionDropDown, usePositioning } from '../helpers/positionPopover'
import { border, boxShadow, radius, textStyle } from '../helpers/theme'

const dropShapeMap = {
  square: 'border-radius: 0 0 1px 1px;',
  intermediate: 'border-radius: 0 0 4px 4px;',
  round: 'border-radius: 0 0 8px 8px;',
}

type ThemeProps = { theme: CactusTheme }

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

interface DropDownProps {
  isOpen: boolean
  anchorRef: React.RefObject<HTMLElement | null>
  variant: MenuButtonVariant
  children?: React.ReactNode
}

interface MenuButtonProps extends MarginProps {
  label: React.ReactNode
  variant?: MenuButtonVariant
  /**
   * Must be a MenuButton.Item or MenuButton.Link
   */
  children: React.ReactNode
  disabled?: boolean
}

type MenuButtonType = React.FC<MenuButtonProps> & {
  Item: typeof ReachMenuItem
  Link: typeof ReachMenuLink
}

export const MenuButton: MenuButtonType = (props) => {
  const { label, children, variant = 'filled', ...rest } = props
  const marginProps = extractMargins(rest)
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Wrapper {...marginProps}>
      <ReachMenu>
        {({ isOpen }) => (
          <>
            <MenuButtonStyles />
            <StyledButton as={ReachMenuButton as any} variant={variant} ref={anchorRef} {...rest}>
              {label}
              <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
            </StyledButton>
            <DropDown isOpen={isOpen} variant={variant} anchorRef={anchorRef}>
              {children}
            </DropDown>
          </>
        )}
      </ReachMenu>
    </Wrapper>
  )
}

const DropDown: React.FC<DropDownProps> = ({ isOpen, variant, anchorRef, children }) => {
  const ref = React.useRef<HTMLElement>(null)
  usePositioning({
    position: positionDropDown,
    visible: isOpen,
    ref,
    anchorRef,
    updateOnScroll: true,
  })
  return (
    <StyledPopover portal={false} ref={ref}>
      <MenuList variant={variant}>{children}</MenuList>
    </StyledPopover>
  )
}

MenuButton.Item = ReachMenuItem
MenuButton.Link = ReachMenuLink

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
        border-radius: ${radius(20)};
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

const StyledButton = styled.button<MenuButtonProps>`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  border-radius: ${radius(20)};
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
`

const Wrapper = styled.div<MarginProps>`
  position: relative;
  display: inline-block;
  max-width: 100%;
  ${margin}
`

const StyledPopover = styled(ReachMenuPopover)`
  position: fixed;
  z-index: 1000;
`

MenuButton.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['filled', 'unfilled']),
}

MenuButton.defaultProps = {
  variant: 'filled',
}

export default MenuButton
