import { NavigationChevronDown } from '@repay/cactus-icons'
import {
  border,
  CactusTheme,
  ColorStyle,
  colorStyle,
  iconSize,
  radius,
  shadow,
  textStyle,
} from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { css, StyledComponentBase } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyDownAsClick } from '../helpers/a11y'
import { positionDropDown, usePositioning } from '../helpers/positionPopover'
import { classes, flexItem, FlexItemProps, withStyles } from '../helpers/styled'
import usePopup, { TogglePopup } from '../helpers/usePopup'
import { MenuListItem } from '../MenuItem/MenuItem'

const ACTIVE_ITEM = '[role="menuitem"]:not([aria-disabled="true"])'
const ITEM_TARGET = `${ACTIVE_ITEM}, ${ACTIVE_ITEM} *`

export type SplitButtonVariant = 'standard' | 'danger' | 'success'

interface VariantProps {
  variant?: SplitButtonVariant
  disabled?: boolean
}

interface StyleProps extends VariantProps, MarginProps, FlexItemProps {}

interface SplitButtonComponent extends StyledComponentBase<'div', CactusTheme, StyleProps> {
  Action: typeof SplitButtonAction
}

interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps {}

interface DialogProps extends React.HTMLAttributes<HTMLElement> {
  anchorRef: React.RefObject<HTMLElement | null>
  variant?: SplitButtonVariant
}

interface SplitButtonActionProps extends React.HTMLAttributes<HTMLElement> {
  main?: boolean
  disabled?: boolean
}

interface GetColor {
  (variant: SplitButtonVariant | undefined, c: CactusTheme['colorStyles']): ColorStyle
  (variant: SplitButtonVariant | undefined, c: CactusTheme['colors']): string
}

const getActionColor: GetColor = (variant, colors: any) => {
  if (variant === 'danger') return colors.errorDark
  else if (variant === 'success') return colors.successDark
  return colors.callToAction
}

const getBaseColor: GetColor = (variant, colors: any) => {
  if (variant === 'danger') return colors.error
  else if (variant === 'success') return colors.success
  return colors.darkestContrast
}

const disabledStyles = css`
  &:disabled {
    ${colorStyle('disable')}
    border-color: transparent;
    cursor: not-allowed;
  }
`

const MainActionButton = withStyles('button', { className: 'SplitButton-main' })<VariantProps>`
  box-sizing: border-box;
  flex-grow: 1;
  border: ${(p) => border(p, getBaseColor(p.variant, p.theme.colors))};
  border-radius: ${radius(20)} 0 0 ${radius(20)};
  ${colorStyle('standard')}
  outline: none;
  ${textStyle('body')};
  font-weight: 400;
  cursor: pointer;
  padding: 2px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    margin-right: 4px;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  &:hover,
  &:focus,
  &.SplitButton-open {
    border-color: ${(p) => getActionColor(p.variant, p.theme.colors)};
  }

  &:focus-visible {
    outline: ${border('callToAction', { thin: '2px' })};
    outline-offset: 1px;
  }

  ${disabledStyles}
`

const Dialog: React.FC<DialogProps> = ({ anchorRef, variant, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const visible = !props['aria-hidden']
  usePositioning({
    position: positionDropDown,
    visible,
    ref,
    anchorRef,
    updateOnScroll: true,
  })
  return <div ref={ref} hidden={!visible} {...props} />
}

const DropDown = withStyles('div', { as: Dialog, className: 'SplitButton-dialog' })`
  position: fixed;
  z-index: 1000;
  padding: 8px 0;
  outline: none;
  border-radius: ${radius(8)};
  ${shadow(1, 'lightContrast')};
  ${colorStyle('standard')}

  [role='menuitem'] {
    display: block;
    overflow-wrap: break-word;
    ${textStyle('small')};
    padding: 4px 16px;
    text-align: center;
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }
    &:focus {
      ${(p) => getActionColor(p.variant, p.theme.colorStyles)}
    }
  }
`

const DropDownButton = withStyles('button', { className: 'SplitButton-dropdown' })<VariantProps>`
  box-sizing: border-box;
  min-width: 36px;
  padding: 0;
  border-radius: 0 ${radius(20)} ${radius(20)} 0;
  margin-left: 1px;
  border: 0;
  outline: none;
  cursor: pointer;
  ${(p) => getBaseColor(p.variant, p.theme.colorStyles)}

  &:hover,
  &:focus,
  &[aria-expanded='true'] {
    ${(p) => getActionColor(p.variant, p.theme.colorStyles)}
  }

  &:focus-visible {
    outline: ${border('callToAction', { thin: '2px' })};
    outline-offset: 1px;
  }

  ${disabledStyles}

  &[aria-expanded='true'] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
  }
  ${NavigationChevronDown} {
    font-size: 10px;
    margin: 0;
    color: ${(p) => p.theme.colors.white};
  }
`

const getMenuItems = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(ACTIVE_ITEM))

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

const getMainAction = (
  children: React.ReactNode,
  actions: React.ReactElement[],
  key: React.Key | null
): React.ReactElement | null => {
  let main: React.ReactElement | null = null
  for (const child of React.Children.toArray(children) as React.ReactElement[]) {
    if (!child || typeof child !== 'object') continue
    if (child.type === React.Fragment) {
      if (child.props.children) {
        const nestedMain = getMainAction(child.props.children, actions, child.key)
        if (!main && nestedMain) main = nestedMain
      }
    } else if (child.props.main) {
      if (!main) main = child
    } else if (key) {
      actions.push(React.cloneElement(child, { key: `${key}${child.key}` }))
    } else {
      actions.push(child)
    }
  }
  return main
}

const BaseSplitButton = (props: SplitButtonProps) => {
  const { disabled, children, 'aria-label': ariaLabel = 'Action List', variant, ...rest } = props
  const { expanded, toggle, wrapperProps, buttonProps, popupProps } = usePopup('menu', {
    id: props.id,
    focusControl: getMenuItems,
    onWrapperKeyDown: handleArrows,
  })
  popupProps.onClick = (e) => {
    const target = e.target as HTMLElement
    if (target.matches(ITEM_TARGET)) {
      const btn = document.getElementById(buttonProps.id as string)
      toggle(false, btn)
    }
  }
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const actions: React.ReactElement[] = []
  const mainAction = getMainAction(children, actions, null) || actions.shift()
  const mainProps: any = mainAction ? { ...mainAction.props } : {}
  delete mainProps.main
  if (disabled) mainProps.disabled = true
  if (expanded) {
    mainProps.className = classes(mainProps.className, 'SplitButton-open')
  }
  return (
    <div {...rest} ref={anchorRef} {...wrapperProps}>
      <MainActionButton {...mainProps} type="button" variant={variant} />
      <DropDownButton
        disabled={disabled || !actions.length}
        aria-label={ariaLabel}
        variant={variant}
        {...buttonProps}
      >
        <NavigationChevronDown aria-hidden />
      </DropDownButton>
      <DropDown variant={variant} anchorRef={anchorRef} {...popupProps}>
        {actions}
      </DropDown>
    </div>
  )
}

const Action: React.FC<SplitButtonActionProps> = (props) => {
  const { main, disabled, ...rest } = props
  if (disabled) {
    delete rest.onClick
    rest['aria-disabled'] = true
  }
  return <div onKeyDown={keyDownAsClick} {...rest} />
}

export const SplitButtonAction = withStyles(MenuListItem, {
  as: Action,
  displayName: 'SplitButton.Action',
})`
  &&[aria-disabled='true'] {
    ${colorStyle('disable')}
    cursor: not-allowed;
  }
`

export const SplitButton: SplitButtonComponent = withStyles('div', {
  displayName: 'SplitButton',
  as: BaseSplitButton,
  styles: [margin, flexItem],
})`
  display: inline-flex;
  max-width: 100%;
  position: relative;

  svg {
    margin-right: 4px;
    font-size: ${iconSize('small')};
  }
` as any

SplitButton.propTypes = {
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['standard', 'danger', 'success']),
}

SplitButton.Action = SplitButtonAction

export default SplitButton
