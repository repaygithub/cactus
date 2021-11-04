import { MenuItemProps } from '@reach/menu-button'
import { IconProps, NavigationChevronDown } from '@repay/cactus-icons'
import { ColorStyle, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyDownAsClick } from '../helpers/a11y'
import { positionDropDown, usePositioning } from '../helpers/positionPopover'
import { border, boxShadow, radius, textStyle } from '../helpers/theme'
import usePopup, { TogglePopup } from '../helpers/usePopup'
import cssVariant from '../helpers/variant'
import { MenuListItem } from '../MenuItem/MenuItem'

export type SplitButtonVariant = 'standard' | 'danger' | 'success'

interface DropDownProps extends React.HTMLAttributes<HTMLElement> {
  anchorRef: React.RefObject<HTMLElement | null>
  variant?: SplitButtonVariant
}

interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps {
  mainActionLabel: React.ReactNode
  onSelectMainAction: (event: React.MouseEvent<HTMLButtonElement>) => void
  mainActionIcon?: React.FunctionComponent<IconProps>
  disabled?: boolean
  // Aria label for the dropdown trigger. Defaults to "Action List"
  'aria-label'?: string
  variant?: SplitButtonVariant
}

interface SplitButtonActionProps extends Omit<MenuItemProps, 'onSelect'> {
  // !important
  onSelect: () => any
  icon?: React.FunctionComponent<IconProps>
}
interface VariantInterface {
  variant?: SplitButtonVariant
}

const mainShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px 1px 1px 8px;',
  round: 'border-radius: 20px 1px 1px 20px;',
}

const getVariantDark = cssVariant({
  standard: css`
    ${(p): ColorStyle => p.theme.colorStyles.callToAction};
  `,
  danger: css`
    ${(p): ColorStyle => p.theme.colorStyles.errorDark};
  `,
  success: css`
    ${(p): ColorStyle => p.theme.colorStyles.successDark};
  `,
})

const MainActionButton = styled.button<VariantInterface>`
  box-sizing: border-box;
  flex-grow: 1;
  border: ${(p) => border(p.theme, '')};
  ${(p) => mainShapeMap[p.theme.shape]}
  background-color: ${(p): string => p.theme.colors.white};
  height: 32px;
  outline: none;
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 400;
  cursor: pointer;
  padding-left: 12px;
  padding-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    margin-right: 4px;
    margin-bottom: 3px;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  ${(p): string =>
    p.disabled
      ? `
    border-color: ${p.theme.colors.lightGray};
    cursor: not-allowed;
  `
      : ''}
  ${(p) => p.disabled && p.theme.colorStyles.disable}

    &.dd-closed {
    ${cssVariant({
      standard: css`
        border-color: ${(p): string => p.theme.colors.darkestContrast};
      `,
      danger: css`
        border-color: ${(p): string => p.theme.colors.error};
      `,
      success: css`
        border-color: ${(p): string => p.theme.colors.success};
      `,
    })}

    &:hover,
      &:focus {
      ${cssVariant({
        standard: css`
          border-color: ${(p): string => p.theme.colors.callToAction};
        `,
        danger: css`
          border-color: ${(p): string => p.theme.colors.errorDark};
        `,
        success: css`
          border-color: ${(p): string => p.theme.colors.successDark};
        `,
      })}
    }
  }

  &.dd-open {
    ${cssVariant({
      standard: css`
        border-color: ${(p): string => p.theme.colors.callToAction};
      `,
      danger: css`
        border-color: ${(p): string => p.theme.colors.errorDark};
      `,
      success: css`
        border-color: ${(p): string => p.theme.colors.successDark};
      `,
    })}
  }
`

const SplitButtonList = styled.div<VariantInterface>`
  position: fixed;
  z-index: 1000;
  padding: 8px 0;
  outline: none;
  border-radius: ${radius(8)};
  ${(p): string => boxShadow(p.theme, 1)};
  background-color: ${(p): string => p.theme.colors.white};
  border: ${(p) => (!p.theme.boxShadows ? border(p.theme, 'lightContrast') : '0')};

  [role='menuitem'] {
    display: block;
    overflow-wrap: break-word;
    ${(p) => textStyle(p.theme, 'small')};
    ${(p): ColorStyle => p.theme.colorStyles.standard};
    padding: 4px 16px;
    text-align: center;
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:focus {
      ${getVariantDark}
    }
  }
`

const dropdownButtonShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 1px 8px 8px 1px;',
  round: 'border-radius: 1px 20px 20px 1px;',
}

const DropdownButton = styled.button<VariantInterface>`
  box-sizing: border-box;
  background-color: ${(p): string => p.theme.colors.darkestContrast};
  height: 32px;
  width: 36px;
  ${(p) => dropdownButtonShapeMap[p.theme.shape]}
  margin-left: 1px;
  border: 0px;
  outline: none;
  cursor: pointer;
  flex-grow: 0;
  ${(p) =>
    p.disabled
      ? p.theme.colorStyles.disable
      : cssVariant({
          standard: p.theme.colorStyles.darkestContrast,
          danger: p.theme.colorStyles.error,
          success: p.theme.colorStyles.success,
        })};

  ${(p): string =>
    p.disabled
      ? `
  cursor: not-allowed;
  `
      : ''}
  &:hover,
  &:focus {
    ${(p) => !p.disabled && getVariantDark};
  }
  ${NavigationChevronDown} {
    width: 10px;
    height: 10px;
    color: ${(p): string => p.theme.colors.white};
  }
`

type SplitButtonType = React.FC<SplitButtonProps> & {
  Action: React.ComponentType<SplitButtonActionProps>
}

const getMenuItems = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]'))

const handleArrows = (event: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) => {
  switch (event.key) {
    case 'ArrowDown':
      toggle(true, 1, { shift: true })
      break
    case 'ArrowUp':
      toggle(true, -1, { shift: true })
      break
    case 'End':
    case 'PageDown':
      toggle(true, -1)
      break
    case 'Home':
    case 'PageUp':
      toggle(true, 0)
      break
    default:
      return
  }
  event.preventDefault()
}

export const SplitButton: SplitButtonType = (props) => {
  const {
    mainActionLabel,
    mainActionIcon: MainActionIcon,
    onSelectMainAction,
    disabled,
    children,
    'aria-label': ariaLabel = 'Action List',
    variant,
    ...rest
  } = props
  const { expanded, toggle, wrapperProps, buttonProps, popupProps } = usePopup('menu', {
    id: props.id,
    focusControl: getMenuItems,
    onWrapperKeyDown: handleArrows,
  })
  popupProps.onClick = (e) => {
    const target = e.target as HTMLElement
    if (target.matches('[role="menuitem"], [role="menuitem"] *')) {
      const btn = document.getElementById(buttonProps.id as string)
      toggle(false, btn)
    }
  }
  const anchorRef = React.useRef<HTMLDivElement>(null)
  return (
    <Wrapper {...rest} ref={anchorRef} {...wrapperProps}>
      <MainActionButton
        className={expanded ? 'dd-open' : !disabled ? 'dd-closed' : ''}
        type="button"
        disabled={disabled}
        onClick={onSelectMainAction}
        variant={variant}
      >
        {MainActionIcon && <MainActionIcon iconSize="small" />}
        {mainActionLabel}
      </MainActionButton>
      <DropdownButton disabled={disabled} aria-label={ariaLabel} variant={variant} {...buttonProps}>
        <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
      </DropdownButton>
      <DropDown variant={variant} anchorRef={anchorRef} {...popupProps}>
        {children}
      </DropDown>
    </Wrapper>
  )
}

const DropDown: React.FC<DropDownProps> = ({ anchorRef, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const visible = !props['aria-hidden']
  usePositioning({
    position: positionDropDown,
    visible,
    ref,
    anchorRef,
    updateOnScroll: true,
  })
  return <SplitButtonList ref={ref} hidden={!visible} {...props} />
}

const Action: React.FC<SplitButtonActionProps> = (props) => {
  const { children, icon: Icon, disabled, onSelect, ...rest } = props
  const onClick = disabled ? undefined : onSelect
  return (
    <div onClick={onClick} {...rest} aria-disabled={disabled} onKeyDown={keyDownAsClick}>
      {Icon && <Icon mr="4px" mb="3px" iconSize="small" aria-hidden="true" />}
      {children}
    </div>
  )
}

export const SplitButtonAction = MenuListItem.withComponent(Action)
SplitButtonAction.displayName = 'SplitButton.Action'

const Wrapper = styled.div<VariantInterface & MarginProps>`
  display: inline-flex;
  max-width: 100%;
  position: relative;
  ${margin}

  ${DropdownButton}[aria-expanded='true'] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
    ${getVariantDark};
  }
`

SplitButton.propTypes = {
  mainActionLabel: PropTypes.node.isRequired,
  onSelectMainAction: PropTypes.func.isRequired,
  mainActionIcon: PropTypes.elementType as any,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['standard', 'danger', 'success']),
}

SplitButton.defaultProps = {
  variant: 'standard',
}

SplitButton.Action = SplitButtonAction

export default SplitButton
