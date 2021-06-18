import { NavigationArrowDown } from '@repay/cactus-icons'
import React from 'react'
import styled from 'styled-components'

import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
const buttonStyles = `
  cursor: pointer;
  border: none;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  text-align: left;
  color: inherit;
  font: inherit;
  display: flex;
  box-sizing: border-box;
  align-items: center;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }
`
export const MenuListItem = styled.span.attrs({
  tabIndex: -1 as number,
  role: 'menuitem' as string,
})`
  ${buttonStyles}
  width: 100%;
  height: 100%;

  ${NavigationArrowDown} {
    width: 8px;
    height: 8px;
    margin-left: 8px;
    ${(p) => (p['aria-expanded'] ? 'transform: scaleY(-1);' : undefined)}
  }
`

export function MenuItemFunc<E, C extends GenericComponent = 'span'>(
  props: AsProps<C>,
  ref: React.Ref<E>
): JSX.Element {
  // The `as any` here is to enable proper use of link substition,
  // e.g. <MenuBar.Item as="a" href="go/go/power/rangers" />
  const propsCopy = { ...props } as any
  if (!propsCopy.onKeyDown) {
    propsCopy.onKeyDown = keyDownAsClick
  }
  const original = propsCopy.onKeyUp
  propsCopy.onKeyUp = !original
    ? preventAction
    : (e: React.KeyboardEvent<HTMLElement>) => {
        original(e)
        preventAction(e)
      }
  return (
    <li role="none">
      <MenuListItem {...propsCopy} ref={ref as any} />
    </li>
  )
}

export type MenuItemType = typeof MenuItemFunc
