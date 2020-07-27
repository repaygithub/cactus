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
            setTimeout(() => {
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
                  left = menuButton.offsetLeft
                }
              } else {
                const expectedRight = buttonRect.right + menuRect.width
                if (expectedRight > maxRight) {
                  left = Math.ceil(buttonRect.left - menuRect.width - offsetRect.left)
                } else {
                  left = Math.ceil(menuButton.offsetLeft + buttonRect.width)
                }
                const expectedBottom = buttonRect.top + menuRect.height
                if (expectedBottom > maxBottom) {
                  top = `${maxBottom - menuRect.height - offsetRect.top}px`
                } else {
                  top = `${menuButton.offsetTop}px`
                }
              }
              // Using translate instead of left because of an issue I had with inconsistent width.
              menuWrapper.style.transform = `translateX(${left}px)`
              menuWrapper.style.top = top || ''
              if (focus) {
                ;(menuWrapper.querySelector(ITEM_SELECTOR) as HTMLElement).focus()
              }
            })
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

export function useSubmenuKeyHandlers(toggle: ToggleSubmenu) {
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

export const menuKeyHandler = (event: React.KeyboardEvent<HTMLElement>) => {
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
      if (menu.scrollToMenuItem) {
        menu.scrollToMenuItem(visibleElements, focusIndex)
        setTimeout(() => toFocus.focus())
      } else {
        toFocus.focus()
      }
    }
    event.stopPropagation()
    event.preventDefault()
    return false
  }
}

interface Scroll {
  showFore?: boolean
  showBack?: boolean
  clickFore?: () => void
  clickBack?: () => void
  left: number
  top: number
  current: number
}

const DEFAULT_SCROLL: Scroll = { left: 0, top: 0, current: 0 }

interface MenuWithScroll extends HTMLUListElement {
  scrollToMenuItem?: (a: HTMLElement[], b: number) => void
}

type MenuRef = (m: MenuWithScroll | null) => void

type ScrollButtonHook = (o: Orientation, e: boolean) => [Scroll, MenuRef]

export const useScrollButtons: ScrollButtonHook = (orientation, expanded) => {
  const [menu, menuRef] = React.useState<MenuWithScroll | null>(null)
  const [scroll, setScroll] = React.useState<Scroll>(DEFAULT_SCROLL)
  React.useEffect(() => {
    if (!expanded) {
      setScroll(() => DEFAULT_SCROLL)
    } else if (menu) {
      let back: 'left' | 'top' = 'left'
      let fore: 'right' | 'bottom' = 'right'
      let width: 'width' | 'height' = 'width'
      if (orientation === 'vertical') {
        back = 'top'
        fore = 'bottom'
        width = 'height'
      }
      const updateScrollState: (s: Scroll) => Scroll = (scroll) => {
        const items = getMenuItems(menu)
        let offset = 0
        let menuWidth = 0
        for (let i = 0; i < items.length; i++) {
          const itemWidth = items[i].getBoundingClientRect()[width]
          menuWidth += itemWidth
          if (i < scroll.current) {
            offset -= itemWidth
          }
        }
        const wrapper = menu.parentElement as HTMLElement
        const parentRect = wrapper.getBoundingClientRect()
        const showBack = scroll.current > 0
        const backButton = showBack ? BUTTON_WIDTH : 0
        const menuBack = parentRect[back] + backButton
        const menuFore = menuBack + menuWidth
        const showFore =
          scroll.current < items.length - 1 && greaterThan(menuFore + offset, parentRect[fore])
        const foreButton = showFore ? BUTTON_WIDTH : 0

        // This is a fix for an IE bug, but it doesn't hurt other browsers.
        const actualWidth = menu.getBoundingClientRect()[width]
        const availableWidth = parentRect[width] - backButton - foreButton
        if (availableWidth > 0 && greaterThan(actualWidth, availableWidth)) {
          menu.style.flexBasis = `${Math.floor(availableWidth)}px`
        } else if (menu.style.flexBasis) {
          menu.style.flexBasis = ''
        }

        // If the offset/button state is unchanged, don't update the state.
        if (showFore === scroll.showFore && equals(scroll[back], offset)) {
          return scroll
        }
        const clickFore = () => {
          let current = scroll.current + 1
          if (current === 1 && orientation === 'vertical') {
            current = 2
          }
          setScroll(updateScrollState({ ...scroll, current }))
        }
        const clickBack = () => {
          let current = scroll.current - 1
          if (current === 1 && orientation === 'vertical') {
            current = 0
          }
          setScroll(updateScrollState({ ...scroll, current }))
        }
        return {
          left: 0,
          top: 0,
          showFore,
          showBack,
          clickFore,
          clickBack,
          [back]: offset,
          current: scroll.current,
        }
      }

      menu.scrollToMenuItem = (items, index) => {
        let next = 0
        if (index < 0) {
          return
        } else if (index !== 0) {
          const itemRect = items[index].getBoundingClientRect()
          const wrapper = menu.parentElement as HTMLElement
          const parentRect = wrapper.getBoundingClientRect()
          const correction = BUTTON_WIDTH - 0.1
          const absBack = parentRect[back] + correction
          const absFore = parentRect[fore] - (index + 1 === items.length ? 0 : correction)
          if (itemRect[back] < absBack) {
            next = index
            if (next === 1 && items[0].getBoundingClientRect()[width] < BUTTON_WIDTH) {
              next = 0
            }
          } else if (itemRect[fore] > absFore) {
            return setScroll((scroll) => {
              let shiftAtLeast = itemRect[fore] - absFore
              let next = scroll.current
              while (shiftAtLeast > 0) {
                shiftAtLeast -= items[next++].getBoundingClientRect()[width]
              }
              if (next >= items.length) {
                next -= 1
              }
              return updateScrollState({ ...scroll, current: next })
            })
          } else {
            return
          }
        }
        setScroll((scroll) => updateScrollState({ ...scroll, current: next }))
      }

      const observer = observeRect(menu, (menuRect) => {
        setScroll(updateScrollState)
      })
      observer.observe()
      return () => observer.unobserve()
    }
  }, [expanded, menu, orientation])
  return [scroll, menuRef]
}
