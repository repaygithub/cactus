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
import usePopup, { TogglePopup } from '../helpers/usePopup'
import { keyPressAsClick } from '../helpers/a11y'

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

const menuListVariants: VariantMap = {
  filled: css`
    border: 0;
    &:hover,
    &:focus {
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    }
  `,
  unfilled: css`
    border: ${(p) => border(p.theme, 'white')};
    &:hover,
    &:focus {
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

const MenuList = styled.ul<MenuListProps>`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  ${getDropDownBorder};
  ${(p) => boxShadow(p.theme, 1)};
  background-color: ${(p) => p.theme.colors.white};
  position: absolute;

  &[aria-hidden='true'] {
    display: none;
  }

  [role='menuitem'] {
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

const enterPopup = (e: React.KeyboardEvent, toggle: TogglePopup) => {
  const isUp = e.key === 'ArrowUp'
  const isDown = e.key === 'ArrowDown'
  if (isUp || isDown) {
    const shift = isUp ? -1 : 1
    toggle(true, shift, { shift: true })
  }
}

const focusControl = (r: HTMLElement) => {
  return Array.from(r.querySelectorAll('[role="menuitem"]'))
}

const positionPopup = (popup, button) => {
  const buttonRect = button.getBoundingClientRect()
  const buttonTop = button.offsetTop
  const buttonLeft = button.offsetLeft
  if (button.offsetParent === popup.offsetParent) {
    popup.style.left = `${buttonLeft}px`
    popup.style.top = `${buttonTop + buttonRect.height}px`
    popup.style.minWidth = `${buttonRect.width}px`
  }
}

function MenuButtonBase(props: MenuButtonProps): React.ReactElement {
  const { label, children, variant = 'filled', ...rest } = omitMargins(props) as Omit<
    MenuButtonProps,
    keyof MarginProps
  >
  const { toggle, setFocus, wrapperProps, buttonProps, popupProps } = usePopup('menu', {
    id: props.id,
    buttonId: props.id,
    onButtonKeyDown: enterPopup,
    focusControl,
    positionPopup,
  })
  delete wrapperProps.id
  const buttonId = buttonProps.id
  popupProps.onClick = React.useCallback<React.MouseEventHandler>((e) => {
    const button = document.getElementById(buttonId)
    toggle(false, button)
  }, [buttonId, toggle])
  popupProps.onKeyDown = React.useCallback<React.KeyboardEventHandler>((e) => {
    if (e.key === 'ArrowUp') {
      e.stopPropagation()
      setFocus(-1, { shift: true })
    } else if (e.key === 'ArrowDown') {
      e.stopPropagation()
      setFocus(1, { shift: true })
    }
  }, [setFocus])
  return (
    <div {...wrapperProps}>
      <button type="button" {...rest} {...buttonProps}>
        {label}
        <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
      </button>
      <MenuList {...popupProps} variant={variant}>{children}</MenuList>
    </div>
  )
}

MenuButtonBase.Item = styled.li`
  list-style: none;
  box-sizing: border-box;
  display: block;
  cursor: pointer;
  text-decoration: none;
  overflow-wrap: break-word;
  ${(p) => textStyle(p.theme, 'small')};
  ${(p) => p.theme.colorStyles.standard};
  outline: none;
  padding: 4px 16px;
  text-align: center;
`
MenuButtonBase.Item.defaultProps = {
  role: 'menuitem',
  tabIndex: -1,
  onKeyPress: keyPressAsClick,
}
MenuButtonBase.Link = styled.a``

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
