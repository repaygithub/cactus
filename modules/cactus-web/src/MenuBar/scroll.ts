import React from 'react'

import { supportsScopeQuery } from '../helpers/constants'
import { FocusControl, FocusSetter } from '../helpers/focus'
import usePopup, { TogglePopup } from '../helpers/usePopup'

const IS_CHAR = /^\S$/
const MENU_SELECTOR = 'nav [aria-orientation]'
const ITEM_SELECTOR = '[role="menuitem"]'
const ITEM_SCOPE_SELECTOR = `:scope > li > ${ITEM_SELECTOR}`
const VISIBLE_ITEM_SELECTOR = `[role="menu"]:not([aria-hidden]) > li > ${ITEM_SELECTOR}`

const getMenu = (fromNode: HTMLElement) => fromNode.parentElement?.closest?.(MENU_SELECTOR)

const query = (scope: Element, selector: string) =>
  Array.from(scope.querySelectorAll<HTMLElement>(selector))

export const getOwnedMenuItems = (menu: HTMLElement): HTMLElement[] => {
  if (supportsScopeQuery) {
    return query(menu, ITEM_SCOPE_SELECTOR)
  } else if (menu.id) {
    const idSelector = `#${menu.id} > li > ${ITEM_SELECTOR}`
    return query(menu, idSelector)
  }
  const elements = query(menu, ITEM_SELECTOR)
  return elements.filter((e) => e.closest(MENU_SELECTOR) === menu)
}

export const getVisibleMenuItems = (menu: HTMLElement): HTMLElement[] =>
  query(menu, VISIBLE_ITEM_SELECTOR)

function positionMenu(menuWrapper: HTMLElement, menuButton: HTMLElement | null) {
  if (!menuButton) return
  menuWrapper = menuWrapper.parentElement as HTMLElement
  const maxRight = window.innerWidth - 25 // Include buffer for scrollbar.
  const maxBottom = window.innerHeight
  const offsetRect = (menuWrapper.offsetParent as HTMLElement).getBoundingClientRect()
  const buttonRect = menuButton.getBoundingClientRect()
  const menuRect = menuWrapper.getBoundingClientRect()
  const orientation = getOrientation(menuButton)
  let left, top
  if (orientation === 'horizontal') {
    const expectedRight = buttonRect.left + menuRect.width
    if (expectedRight > maxRight) {
      left = Math.ceil(maxRight - menuRect.width - offsetRect.left)
    } else {
      left = buttonRect.left - offsetRect.left
    }
  } else {
    const expectedRight = buttonRect.right + menuRect.width
    if (expectedRight > maxRight) {
      left = Math.ceil(buttonRect.left - menuRect.width - offsetRect.left)
    } else {
      left = Math.ceil(buttonRect.left - offsetRect.left + buttonRect.width)
    }
    const expectedBottom = buttonRect.top + menuRect.height
    if (expectedBottom > maxBottom) {
      top = `${maxBottom - menuRect.height - offsetRect.top}px`
    } else {
      top = `${buttonRect.top - offsetRect.top}px`
    }
  }
  // Using translate instead of left because of an issue I had with inconsistent width.
  // Using 3d because Safari handles the z-index stupidly https://bucketpress.com/css-translate-and-z-index-problems-in-safari-browser
  menuWrapper.style.transform = `translate3d(${left}px, 0, 0)`
  menuWrapper.style.top = top || ''
}

const isExpanded = (button: HTMLElement) => button.getAttribute('aria-expanded') === 'true'
const openKey = (orientation: any) => (orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown')
const closeKey = (orientation: any) => (orientation === 'vertical' ? 'ArrowLeft' : 'ArrowUp')
const getOrientation = (element: HTMLElement) => {
  const menu = getMenu(element)
  return menu && menu.getAttribute('aria-orientation')
}

function handleArrows(event: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) {
  const menuButton = event.currentTarget.querySelector('[role="menuitem"]')
  if (menuButton instanceof HTMLElement) {
    const orientation = getOrientation(event.currentTarget)
    if (event.key === closeKey(orientation) && isExpanded(menuButton)) {
      event.stopPropagation()
      toggle(false, menuButton)
    } else if (event.key === openKey(orientation)) {
      event.stopPropagation()
      toggle(true, 1, { shift: true })
    } else if (event.key === 'ArrowLeft' && isExpanded(menuButton)) {
      event.stopPropagation()
    }
  }
}

function handleButtonClick(event: React.MouseEvent<HTMLElement>, toggle: TogglePopup) {
  event.preventDefault()
  const wrapper = event.currentTarget.nextElementSibling as HTMLElement
  toggle(undefined, wrapper)
}

export function useSubmenu(
  id: string | undefined,
  usePositioning: boolean
): ReturnType<typeof usePopup> {
  const popup = usePopup('menu', {
    id,
    buttonId: id,
    onWrapperKeyDown: handleArrows,
    onButtonClick: handleButtonClick,
    focusControl: getOwnedMenuItems,
    positionPopup: usePositioning ? positionMenu : undefined,
  })
  delete popup.wrapperProps.id
  popup.buttonProps.role = 'menuitem'
  popup.popupProps.onKeyDown = useMenuKeyHandler(popup.setFocus, usePositioning)
  return popup
}

export function useMenu(id: string | undefined): ReturnType<typeof usePopup> {
  const popup = usePopup('menu', {
    id,
    onButtonClick: handleButtonClick,
    focusControl: getOwnedMenuItems,
  })
  popup.popupProps.onKeyDown = useMenuKeyHandler(popup.setFocus, false)
  return popup
}

type KeyHandler = React.KeyboardEventHandler<HTMLElement>

export const useMenuKeyHandler = (setFocus: FocusSetter, isWrapper: boolean): KeyHandler =>
  React.useCallback<KeyHandler>(
    (event) => {
      const menu = (
        !isWrapper ? event.currentTarget : event.currentTarget.querySelector('ul')
      ) as HTMLElement
      const orientation = menu.getAttribute('aria-orientation')
      const scrollForward = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
      const scrollBack = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
      const parentOrientation = getOrientation(menu)
      const allowWrapBack = !parentOrientation || parentOrientation === orientation
      let propagate = false
      switch (event.key) {
        case scrollForward:
          setFocus(1, { shift: true })
          break
        case scrollBack:
          let control: FocusControl | undefined
          if (!allowWrapBack) {
            control = (root, { focusIndex }) => {
              if (focusIndex <= 0) {
                propagate = true
                return
              }
              return getOwnedMenuItems(root)
            }
          }
          setFocus(-1, { shift: true, control })
          break
        // Prevent these from propagating up to the next menu.
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          event.stopPropagation()
          return
        case 'Home':
        case 'PageUp':
          setFocus(0)
          break
        case 'End':
        case 'PageDown':
          setFocus(-1)
          break
        default:
          // Search for the closest menu item that starts with the typed letter.
          if (IS_CHAR.test(event.key)) {
            setFocus(event.key)
            break
          }
          return // If unhandled at this point, we'll allow propagation.
      }
      event.preventDefault()
      if (!propagate) {
        event.stopPropagation()
      }
    },
    [isWrapper, setFocus]
  )
