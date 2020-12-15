import observeRect from '@reach/observe-rect'
import React from 'react'

import { FocusControl, FocusSetter } from '../helpers/focus'
import usePopup, { TogglePopup } from '../helpers/usePopup'

type Orientation = 'horizontal' | 'vertical'

const IS_CHAR = /^\S$/
const BUTTON_WIDTH = 34 // 16 padding, 18 icon
export const ITEM_SELECTOR = '[role="menuitem"]'

const equals = (left: number, right: number) => Math.abs(left - right) < 0.1

const greaterThan = (left: number, right: number) => left + 0.1 - right > 0

const getMenu: (f: HTMLElement) => HTMLElement | undefined = (fromNode) => {
  const parent = fromNode.parentElement
  if (parent) {
    if (parent.matches('[role^="menu"]')) {
      return parent
    } else if (fromNode.matches('nav')) {
      return fromNode
      // Don't bother searching past the menubar.
    } else if (fromNode.getAttribute('role') !== 'menubar') {
      return getMenu(parent)
    }
  }
}

const getMenuItems = (menu: HTMLElement, directChildrenOnly: boolean): HTMLElement[] => {
  const elements = Array.from(menu.querySelectorAll(ITEM_SELECTOR)) as HTMLElement[]
  if (directChildrenOnly) {
    return elements.filter((e) => getMenu(e) === menu)
  }
  return elements.filter((e) => e.offsetWidth)
}

function positionMenu(menuWrapper: HTMLElement, menuButton: HTMLElement | null) {
  if (!menuButton) return
  menuWrapper = menuWrapper.parentElement as HTMLElement
  const maxRight = window.innerWidth - 25 // Include buffer for scrollbar.
  const maxBottom = window.innerHeight
  const offsetRect = (menuWrapper.offsetParent as HTMLElement).getBoundingClientRect()
  const buttonRect = menuButton.getBoundingClientRect()
  const menuRect = menuWrapper.getBoundingClientRect()
  const parentMenu = getMenu(menuButton)
  const orientation = parentMenu && parentMenu.getAttribute('aria-orientation')
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
  menuWrapper.style.transform = `translateX(${left}px)`
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

export function menuFocusControl(menu: HTMLElement): HTMLElement[] {
  return getMenuItems(menu, true)
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
    focusControl: menuFocusControl,
    positionPopup: usePositioning ? positionMenu : undefined,
  })
  delete popup.wrapperProps.id
  popup.buttonProps.role = 'menuitem'
  popup.popupProps.onFocus = focusMenu
  popup.popupProps.onKeyDown = useMenuKeyHandler(popup.setFocus)
  return popup
}

export function useMenu(id: string | undefined): ReturnType<typeof usePopup> {
  const popup = usePopup('menu', {
    id,
    onButtonClick: handleButtonClick,
    focusControl: menuFocusControl,
  })
  popup.popupProps.onFocus = focusMenu
  popup.popupProps.onKeyDown = useMenuKeyHandler(popup.setFocus)
  return popup
}

type KeyHandler = React.KeyboardEventHandler<HTMLElement>

export const useMenuKeyHandler = (setFocus: FocusSetter): KeyHandler =>
  React.useCallback<KeyHandler>(
    (event) => {
      const menu = (event.currentTarget.matches('ul')
        ? event.currentTarget
        : event.currentTarget.querySelector('ul')) as MenuWithScroll
      const parentMenu = getMenu(menu)
      const orientation = menu.getAttribute('aria-orientation')
      const scrollForward = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
      const scrollBack = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
      const allowWrapBack =
        !parentMenu || parentMenu.getAttribute('aria-orientation') === orientation
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
              return menuFocusControl(root)
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
    [setFocus]
  )

interface Scroll {
  showButtons?: boolean
  clickFore?: () => void
  clickBack?: () => void
  offset: number
  current: number
}

const DEFAULT_SCROLL: Scroll = { offset: 0, current: 0 }

interface MenuWithScroll extends HTMLUListElement {
  scrollToMenuItem?: (target: HTMLElement) => void
}

type MenuRef = React.RefObject<HTMLUListElement>

type ScrollInfo = (e: HTMLElement) => [HTMLElement, number, HTMLElement[]]
type ScrollButtonHook = (o: Orientation, e: boolean, si?: ScrollInfo) => [MenuRef, Scroll]

const getScrollInfo: ScrollInfo = (element) => {
  const overflow = window.getComputedStyle(element).overflow
  if (overflow === 'hidden') {
    return [element.parentElement as HTMLElement, BUTTON_WIDTH, getMenuItems(element, true)]
  } else if (overflow === 'auto') {
    return [element, 0, getMenuItems(element, false)]
  }
  return getScrollInfo(element.parentElement as HTMLElement)
}

export const useScrollButtons: ScrollButtonHook = (
  orientation,
  expanded,
  getSI = getScrollInfo
) => {
  const menuRef = React.useRef<HTMLUListElement>(null)
  const [scroll, setScroll] = React.useState<Scroll>(DEFAULT_SCROLL)
  React.useEffect(() => {
    if (!expanded) {
      setScroll(() => DEFAULT_SCROLL)
    } else if (menuRef.current) {
      const menu = menuRef.current as MenuWithScroll
      let back: 'left' | 'top' = 'left'
      let fore: 'right' | 'bottom' = 'right'
      let width: 'width' | 'height' = 'width'
      let scrollAttr: 'scrollLeft' | 'scrollTop' = 'scrollLeft'
      let scrollWidth: 'scrollWidth' | 'scrollHeight' = 'scrollWidth'
      if (orientation === 'vertical') {
        back = 'top'
        fore = 'bottom'
        width = 'height'
        scrollAttr = 'scrollTop'
        scrollWidth = 'scrollHeight'
      }
      const updateScrollState = (scroll: Scroll, target?: number | HTMLElement): Scroll => {
        const [wrapper, buttonWidth, items] = getSI(menu)

        const parentRect = wrapper.getBoundingClientRect()
        const itemRects = items.map((i) => i.getBoundingClientRect())
        let maxButton = items.length - 1
        const showButtons = menu[scrollWidth] > Math.round(parentRect[width])
        const maxWidth = parentRect[width] - (showButtons ? buttonWidth * 2 : 0)
        let button: number = scroll.current
        if (typeof target === 'number') {
          button = target
        } else if (target) {
          button = items.indexOf(target)
          if (button < 0) {
            return scroll
          } else if (button > 0 && showButtons) {
            const span = itemRects[button][fore] - itemRects[scroll.current][back]
            if (span > maxWidth) {
              maxButton = button
            } else if (button > scroll.current) {
              button = scroll.current
            }
          }
        }

        let menuWidth = 0
        let offset = 0
        for (let i = maxButton; i >= 0; i--) {
          const itemWidth = itemRects[i][width]
          menuWidth += itemWidth
          if (menuWidth < maxWidth) {
            maxButton = i
            button = Math.min(button, maxButton)
          } else if (i < button) {
            offset += itemWidth
          }
        }

        // This is a fix for an IE bug with nested flex items.
        // TODO Do I still need this now that buttons are always visible?
        if (
          buttonWidth &&
          parentRect[width] > 0 &&
          /MSIE|Trident/.test(window.navigator.userAgent)
        ) {
          menu.style.maxHeight = `calc(70vh - ${buttonWidth * 2}px)`
        }

        // If the offset/button state is unchanged, don't update the state.
        if (
          showButtons === scroll.showButtons &&
          equals(scroll.offset, offset) &&
          button === scroll.current
        ) {
          return scroll
        }
        const result: Scroll = {
          showButtons,
          offset,
          current: button,
        }
        if (greaterThan(menu[scrollWidth] - offset, maxWidth)) {
          result.clickFore = () => {
            setScroll(updateScrollState(result, result.current + 1))
          }
        }
        if (button > 0) {
          result.clickBack = () => {
            setScroll(updateScrollState(result, result.current - 1))
          }
        }
        // Set the actual scroll offset on the menu.
        const scrollElement = buttonWidth ? menu : wrapper
        scrollElement[scrollAttr] = offset
        return result
      }

      menu.scrollToMenuItem = (target) => {
        setScroll((s) => updateScrollState(s, target))
      }

      const observer = observeRect(menu, () => {
        setScroll(updateScrollState)
      })
      observer.observe()
      return () => observer.unobserve()
    }
  }, [expanded, menuRef, orientation, getSI])
  return [menuRef, scroll]
}

export const focusMenu = (event: React.FocusEvent<HTMLElement>): void => {
  if (event.target.matches(ITEM_SELECTOR)) {
    const menu = event.currentTarget as MenuWithScroll
    if (menu.scrollToMenuItem) {
      menu.scrollToMenuItem(event.target as HTMLElement)
    }
  }
}
