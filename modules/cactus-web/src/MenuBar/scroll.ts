import observeRect from '@reach/observe-rect'
import React from 'react'

import { isActionKey } from '../helpers/a11y'

type Orientation = 'horizontal' | 'vertical'

const PRINTABLE = /^\S$/
const BUTTON_WIDTH = 34 // 16 padding, 18 icon
export const ITEM_SELECTOR = '[role="menuitem"]'

const equals = (left: number, right: number) => Math.abs(left - right) < 0.1

const greaterThan = (left: number, right: number) => left + 0.1 - right > 0

const getMenu: (f: HTMLElement) => HTMLElement | undefined = (fromNode) => {
  const parent = fromNode.parentElement
  if (parent) {
    if (parent.matches('[role^="menu"]')) {
      return parent
      // Don't bother searching past the menubar.
    } else if (fromNode.getAttribute('role') !== 'menubar') {
      return getMenu(parent)
    }
  }
}

const getMenuItems: (m: HTMLElement) => HTMLElement[] = (menu) => {
  const elements = [...(menu.querySelectorAll(ITEM_SELECTOR) as any)] as HTMLElement[]
  return elements.filter((e) => e.offsetWidth && getMenu(e) === menu)
}

type ToggleSubmenu = (b: HTMLElement | null, o: boolean | undefined, f?: boolean) => void

export function useSubmenuToggle(): [boolean, ToggleSubmenu] {
  const [expanded, setExpanded] = React.useState<boolean>(false)
  const toggle = React.useCallback<ToggleSubmenu>(
    (menuButton, open, focus = false) => {
      setExpanded((isExpanded: boolean) => {
        if (open !== isExpanded) {
          isExpanded = open === undefined ? !isExpanded : open
          // Was closed, now open
          if (isExpanded && menuButton) {
            const menuWrapper = menuButton.nextElementSibling as HTMLElement
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
            if (focus) {
              const firstItem = menuWrapper.querySelector(ITEM_SELECTOR) as HTMLElement
              setTimeout(() => firstItem.focus())
            }
          }
        }
        return isExpanded
      })
    },
    [setExpanded]
  )
  return [expanded, toggle]
}

const isExpanded = (button: HTMLElement) => button.getAttribute('aria-expanded') === 'true'
const openKey = (orientation: any) => (orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown')
const closeKey = (orientation: any) => (orientation === 'vertical' ? 'ArrowLeft' : 'ArrowUp')
const getOrientation = (element: HTMLElement) => {
  const menu = getMenu(element)
  return menu && menu.getAttribute('aria-orientation')
}

type KeyHandler = (e: React.KeyboardEvent<HTMLElement>) => void

export function useSubmenuKeyHandlers(toggle: ToggleSubmenu): [KeyHandler, KeyHandler] {
  const handleToggle = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const menuButton = event.currentTarget
      const orientation = getOrientation(menuButton)
      if (isActionKey(event)) {
        event.preventDefault()
        event.stopPropagation()
        toggle(menuButton, undefined, true)
      } else if (!isExpanded(menuButton) && event.key === openKey(orientation)) {
        event.stopPropagation()
        toggle(menuButton, true, true)
      }
    },
    [toggle]
  )
  const handleSubmenu = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const menuButton = event.currentTarget.querySelector(ITEM_SELECTOR) as HTMLElement
      if (isExpanded(menuButton)) {
        const orientation = getOrientation(event.currentTarget)
        switch (event.key) {
          case 'Escape':
          case closeKey(orientation):
            toggle(menuButton, false)
            menuButton.focus()
            break
          case openKey(orientation):
            const menu = event.currentTarget.querySelector('[role="menu"]')
            const items = getMenuItems(menu as HTMLElement)
            const currentFocus = items.indexOf(document.activeElement as HTMLElement)
            items[(currentFocus + 1) % items.length].focus()
            break
          default:
            return
        }
        event.stopPropagation()
        event.preventDefault()
      }
    },
    [toggle]
  )
  return [handleToggle, handleSubmenu]
}

export const menuKeyHandler = (event: React.KeyboardEvent<HTMLElement>): void => {
  const menu = event.currentTarget as MenuWithScroll
  const parentMenu = getMenu(menu)
  const orientation = menu.getAttribute('aria-orientation')
  const scrollForward = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  const scrollBack = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const allowWrapBack = !parentMenu || parentMenu.getAttribute('aria-orientation') === orientation
  const visibleElements = getMenuItems(menu)
  const currentFocus = visibleElements.indexOf(document.activeElement as HTMLElement)
  let focusIndex = -1
  switch (event.key) {
    case scrollForward:
      focusIndex = (currentFocus + 1) % visibleElements.length
      break
    case scrollBack:
      if (currentFocus > 0) {
        focusIndex = currentFocus - 1
        // If wrapback isn't allowed, focus will return to the parent menu.
      } else if (currentFocus === 0 && allowWrapBack) {
        focusIndex = visibleElements.length - 1
      }
      break
    // Prevent these from propagating up to the next menu.
    case 'ArrowRight':
    case 'Enter':
    case ' ':
      event.stopPropagation()
      return
    case 'Home':
    case 'PageUp': // TODO Once the scrolling is implemented, I'll want to shift this to approximately one page-worth of links up
      focusIndex = 0
      break
    case 'End':
    case 'PageDown':
      focusIndex = visibleElements.length - 1
      break
    default:
      // Search for the closest menu item that starts with the typed letter.
      if (PRINTABLE.test(event.key)) {
        const offset = Math.max(currentFocus, 0)
        for (let i = 0; i < visibleElements.length; i++) {
          const index = (i + offset) % visibleElements.length
          const text = visibleElements[index].textContent
          if (text && text.toLowerCase().startsWith(event.key.toLowerCase())) {
            focusIndex = index
            break
          }
        }
      }
      break
  }
  if (focusIndex >= 0) {
    const toFocus = visibleElements[focusIndex]
    if (toFocus !== document.activeElement) {
      toFocus.focus()
    }
    event.stopPropagation()
    event.preventDefault()
  }
}

interface Scroll {
  showFore?: boolean
  showBack?: boolean
  clickFore?: () => void
  clickBack?: () => void
  offset: number
  current: number
}

const DEFAULT_SCROLL: Scroll = { offset: 0, current: 0 }

interface MenuWithScroll extends HTMLUListElement {
  scrollToMenuItem?: (a: HTMLElement[], b: number) => void
}

type MenuElement = MenuWithScroll | null

type MenuRef = (m: MenuElement) => void

type ScrollButtonHook = (o: Orientation, e: boolean) => [Scroll, MenuRef, MenuElement]

export const useScrollButtons: ScrollButtonHook = (orientation, expanded) => {
  const [menu, menuRef] = React.useState<MenuElement>(null)
  const [scroll, setScroll] = React.useState<Scroll>(DEFAULT_SCROLL)
  React.useEffect(() => {
    if (!expanded) {
      setScroll(() => DEFAULT_SCROLL)
    } else if (menu) {
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
      const updateScrollState: (s: Scroll, b?: number) => Scroll = (scroll, button) => {
        const items = getMenuItems(menu)
        let maxButton = items.length - 1
        button = Math.min(maxButton, button === undefined ? scroll.current : button)
        const wrapper = menu.parentElement as HTMLElement
        const parentRect = wrapper.getBoundingClientRect()
        let maxTrailingWidth = Math.ceil(parentRect[width] - BUTTON_WIDTH)
        let menuWidth = 0
        let offset = 0
        for (let i = maxButton; i >= 0; i--) {
          const itemWidth = items[i].getBoundingClientRect()[width]
          menuWidth += itemWidth
          if (i === 0) {
            maxTrailingWidth += BUTTON_WIDTH
          }
          if (menuWidth < maxTrailingWidth) {
            maxButton = i
            button = Math.min(button, maxButton)
          } else if (i < button) {
            offset += itemWidth
          }
        }
        if (button === 1 && items[0].getBoundingClientRect()[width] < BUTTON_WIDTH) {
          if (button > scroll.current && maxButton > 1) {
            return updateScrollState(scroll, 2)
          } else if (button < scroll.current) {
            return updateScrollState(scroll, 0)
          }
        }

        const showBack = button > 0
        let buttonWidth = showBack ? BUTTON_WIDTH : 0
        const showFore = greaterThan(menuWidth - offset, parentRect[width] - buttonWidth)
        if (showFore) {
          buttonWidth += BUTTON_WIDTH
        }

        // This is a fix for an IE bug with nested flex items.
        if (parentRect[width] > 0 && /MSIE|Trident/.test(window.navigator.userAgent)) {
          menu.style.maxHeight = `calc(70vh - ${buttonWidth}px)`
        }

        // If the offset/button state is unchanged, don't update the state.
        if (
          showFore === scroll.showFore &&
          equals(scroll.offset, offset) &&
          button === scroll.current
        ) {
          return scroll
        }
        // Set the actual scroll offset on the menu.
        menu[scrollAttr] = offset
        const result: Scroll = {
          showFore,
          showBack,
          offset,
          current: button,
        }
        result.clickFore = () => {
          setScroll(updateScrollState(result, result.current + 1))
        }
        result.clickBack = () => {
          setScroll(updateScrollState(result, result.current - 1))
        }
        return result
      }

      type Calc = (r: DOMRect[], i: number, t: boolean, m: number) => number
      const calcNextButton: Calc = (itemRects, index, toTop, minBack) => {
        for (let i = index; i >= 0; i--) {
          if (Math.round(itemRects[i][back]) < minBack) {
            // If we run calculations to the top and get an index > 0, we guessed wrong.
            if (toTop) {
              return calcNextButton(itemRects, index, false, minBack + BUTTON_WIDTH)
            }
            return Math.min(i + 1, index)
          }
        }
        return 0
      }

      menu.scrollToMenuItem = (items, index) => {
        const wrapper = menu.parentElement as HTMLElement
        const parentRect = wrapper.getBoundingClientRect()
        let next = 0
        if (index < 0) {
          return
        } else if (index > 0 && menu[scrollWidth] > Math.round(parentRect[width])) {
          const itemRects = items.map((i) => i.getBoundingClientRect())
          const max = Math.round(parentRect[fore])
          // If the button is offscreen, shift all calculations to where it's onscreen;
          // start by assuming the button is visible, then adjust if that's impossible.
          let shift = Math.min(0, max - BUTTON_WIDTH - Math.round(itemRects[index][fore]))
          const end = Math.round(itemRects[itemRects.length - 1][fore])
          if (end + shift <= max) {
            shift = Math.min(0, shift + BUTTON_WIDTH)
          }
          const min = Math.round(parentRect[back]) - shift
          next = calcNextButton(itemRects, index, true, min)
        }
        setScroll((s) => updateScrollState(s, next))
      }

      const observer = observeRect(menu, () => {
        setScroll(updateScrollState)
      })
      observer.observe()
      return () => observer.unobserve()
    }
  }, [expanded, menu, orientation])
  return [scroll, menuRef, menu]
}

export const focusMenu = (event: React.FocusEvent<HTMLElement>): void => {
  if (event.target.matches(ITEM_SELECTOR)) {
    const menu = event.currentTarget as MenuWithScroll
    if (menu.scrollToMenuItem) {
      const items = getMenuItems(menu)
      menu.scrollToMenuItem(items, items.indexOf(event.target))
    }
  }
}
