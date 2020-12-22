import React from 'react'
import styled from 'styled-components'

import { observeSize } from './rect'

type Orientation = 'horizontal' | 'vertical'

export interface Scroll {
  showScroll: boolean
  clickFore?: () => void
  clickBack?: () => void
  offset: number
  currentIndex: number
}

const DEFAULT_SCROLL: Scroll = { showScroll: false, offset: 0, currentIndex: 0 }

// Takes in a list element and returns three things:
// 1. The outermost wrapper; either the list itself if it's a regular scroll element,
//    or the container of the list + buttons if it's `overflow: hidden`.
// 2. The width of one button, or 0 (zero) if it's a regular scroll element.
// 3. The list of items that can be scrolled to.
export type GetScrollInfo = (e: HTMLElement) => [HTMLElement, number, HTMLElement[]]

interface Rect {
  left: number
  right: number
  width: number
}

const getRect = (e: Element): Rect => e.getBoundingClientRect()
const getVerticalRect = (e: Element): Rect => {
  const rect = e.getBoundingClientRect()
  return { left: rect.top, right: rect.bottom, width: rect.height }
}

export function useScroll<T extends HTMLElement>(
  orientation: Orientation,
  isVisible: boolean,
  getScrollInfo: GetScrollInfo
): [React.RefObject<T>, Scroll] {
  const listRef = React.useRef<T>(null)
  const [scroll, setScroll] = React.useState<Scroll>(DEFAULT_SCROLL)

  React.useEffect(() => {
    if (!isVisible) {
      setScroll(() => DEFAULT_SCROLL)
    } else if (listRef.current) {
      const list = listRef.current
      // For simplicity's sake, map vertical lists to horizontal terminology.
      const isHorizontal = orientation !== 'vertical'
      const getMappedRect = isHorizontal ? getRect : getVerticalRect
      const scrollOffset = isHorizontal ? 'scrollLeft' : 'scrollTop'

      const updateScrollState = (scroll: Scroll, target?: number | HTMLElement): Scroll => {
        const [wrapper, buttonWidth, items] = getScrollInfo(list)

        const parentRect = getMappedRect(wrapper)
        const scrollWidth = isHorizontal ? list.scrollWidth : list.scrollHeight
        if (greaterThan(parentRect.width, scrollWidth)) {
          return DEFAULT_SCROLL
        }
        let offset = 0
        let nextIndex: number = scroll.currentIndex
        const currentOffset = list[scrollOffset]
        const visibleWidth = parentRect.width - buttonWidth * 2
        const itemRects = items.map(getMappedRect)
        if (typeof target === 'object') {
          nextIndex = items.indexOf(target)
          if (nextIndex < 0) {
            return scroll
          } else if (nextIndex > 0) {
            const itemRect = itemRects[nextIndex]
            const visibleLeft = parentRect.left + buttonWidth
            if (greaterThan(visibleLeft, itemRect.left)) {
              // Offscreen to the left, offset is sum of all items to the left.
              for (let i = nextIndex - 1; i >= 0; i--) {
                offset += itemRects[i].width
              }
            } else if (greaterThan(itemRect.right, parentRect.right - buttonWidth)) {
              // Offscreen to the right, offset is all items to the left - visible width.
              for (let i = nextIndex; i >= 0; i--) {
                if (greaterThan(visibleWidth, offset)) {
                  nextIndex = i
                }
                offset += itemRects[i].width
              }
              offset = Math.ceil(offset - visibleWidth)
            } else {
              // Currently onscreen, just need to find the currentIndex.
              offset = currentOffset
              for (let i = nextIndex - 1; i >= 0; i--) {
                if (greaterThan(itemRects[i].left, visibleLeft)) {
                  nextIndex = i
                }
              }
            }
          }
        } else if (typeof target === 'number') {
          nextIndex = target
          let menuWidth = 0
          for (let i = items.length - 1; i >= 0; i--) {
            const itemWidth = itemRects[i].width
            menuWidth += itemWidth
            if (menuWidth < visibleWidth) {
              nextIndex = Math.min(nextIndex, i)
            } else if (i < nextIndex) {
              offset += itemWidth
            }
          }
        } else {
          // No target, keep the offset the same.
          offset = scroll.offset
        }

        // Set the actual scroll offset on the list.
        if (!equals(offset, currentOffset)) {
          list[scrollOffset] = offset
        } else if (
          equals(offset, scroll.offset) &&
          scroll.showScroll &&
          nextIndex === scroll.currentIndex
        ) {
          // If the offset/index state is unchanged, don't update the state.
          return scroll
        }
        const result: Scroll = {
          offset,
          showScroll: true,
          currentIndex: nextIndex,
        }
        if (buttonWidth && !greaterThan(visibleWidth, scrollWidth - offset)) {
          result.clickFore = () => {
            setScroll(updateScrollState(result, result.currentIndex + 1))
          }
        }
        if (buttonWidth && nextIndex > 0) {
          result.clickBack = () => {
            setScroll(updateScrollState(result, result.currentIndex - 1))
          }
        }
        return result
      }

      let isMouseEvent = false

      const onMouseDown = () => {
        isMouseEvent = true
      }
      const onClick = (e: MouseEvent) => {
        // Ignore any lower-level layout/style elements (hopefully).
        const target = (e.target as HTMLElement).closest('[role]')
        isMouseEvent = false
        setScroll((s) => updateScrollState(s, target as HTMLElement))
      }
      const onFocus = ({ target }: FocusEvent) => {
        if (!isMouseEvent) {
          setScroll((s) => updateScrollState(s, target as HTMLElement))
        }
      }
      list.addEventListener('mousedown', onMouseDown)
      list.addEventListener('click', onClick)
      list.addEventListener('focusin', onFocus)
      const unobserve = observeSize(list, () => setScroll(updateScrollState))
      return () => {
        unobserve()
        list.removeEventListener('mousedown', onMouseDown)
        list.removeEventListener('click', onClick)
        list.removeEventListener('focusin', onFocus)
      }
    }
  }, [isVisible, listRef, orientation, getScrollInfo])
  return [listRef, scroll]
}

const equals = (left: number, right: number) => Math.abs(left - right) < 0.1
const greaterThan = (left: number, right: number) => left + 0.1 - right > 0

export const BUTTON_WIDTH = 34 // 16 margin, 18 icon
export const ScrollButton = styled.div.attrs({ 'aria-hidden': true })`
  ${(p) => p.theme.colorStyles.standard};
  display: flex;
  &[hidden] {
    display: none;
  }
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background-color: transparent;
  text-align: center;
  outline: none;
  ${(p) =>
    !!p.onClick
      ? `
    cursor: pointer;
    :hover {
      color: ${p.theme.colors.callToAction};
    }
    `
      : `
    cursor: not-allowed;
    color: ${p.theme.colors.lightGray};
    `}
  svg {
    width: 18px;
    height: 18px;
    margin: 8px;
  }
`
