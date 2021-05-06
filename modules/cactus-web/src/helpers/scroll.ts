import observeRect from '@reach/observe-rect'
import React from 'react'
import styled from 'styled-components'

const supportsOverscroll: boolean =
  typeof window !== 'undefined' && window.CSS?.supports?.('overscroll-behavior', 'none')

export function trapScroll<T extends HTMLElement>({
  current: scrollTrap,
}: React.RefObject<T | null>): ReturnType<React.EffectCallback> {
  if (scrollTrap && !supportsOverscroll) {
    const onWheel = (event: WheelEvent) => {
      const scroll = Math.abs(scrollTrap.scrollTop)
      let allowScroll = true
      if (event.deltaY < 0) {
        allowScroll = scroll !== 0
      } else if (scrollTrap.scrollHeight - scroll === scrollTrap.clientHeight) {
        allowScroll = false
      }
      if (!allowScroll) {
        event.preventDefault()
      }
    }

    scrollTrap.addEventListener('wheel', onWheel)
    return () => {
      scrollTrap.removeEventListener('wheel', onWheel)
    }
  } else if (scrollTrap) {
    scrollTrap.style.overscrollBehavior = 'none'
  }
}

export function useScrollTrap<T extends HTMLElement>(ref: React.RefObject<T | null>): void {
  React.useEffect(() => trapScroll(ref), [ref])
}

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
export type GetScrollInfo = (
  e: HTMLElement
) => {
  listWrapper: HTMLElement
  buttonWidth: number
  listItems: HTMLElement[]
}

interface Rect {
  left: number
  right: number
  width: number
}

const getRect = (e: Element): Rect => {
  const r = e.getBoundingClientRect()
  return { left: Math.floor(r.left), right: Math.ceil(r.right), width: Math.ceil(r.width) }
}
const getVerticalRect = (e: Element): Rect => {
  const r = e.getBoundingClientRect()
  return { left: Math.floor(r.top), right: Math.ceil(r.bottom), width: Math.ceil(r.height) }
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

      const updateScrollState = (scrollState: Scroll, target?: number | HTMLElement): Scroll => {
        const { listWrapper, buttonWidth, listItems } = getScrollInfo(list)

        const parentRect = getMappedRect(listWrapper)
        const scrollWidth = isHorizontal ? list.scrollWidth : list.scrollHeight
        if (parentRect.width >= scrollWidth) {
          return DEFAULT_SCROLL
        }
        let offset = 0
        let nextIndex: number = scrollState.currentIndex
        const currentOffset = list[scrollOffset]
        const visibleWidth = parentRect.width - buttonWidth * 2
        const itemRects = listItems.map(getMappedRect)
        if (typeof target === 'object') {
          nextIndex = listItems.indexOf(target)
          if (nextIndex < 0) {
            return scrollState
          } else if (nextIndex > 0) {
            const itemRect = itemRects[nextIndex]
            const visibleLeft = parentRect.left + buttonWidth
            if (visibleLeft > itemRect.left) {
              // Offscreen to the left, offset is sum of all items to the left.
              for (let i = nextIndex - 1; i >= 0; i--) {
                offset += itemRects[i].width
              }
            } else if (itemRect.right > parentRect.right - buttonWidth) {
              // Offscreen to the right, offset is all items to the left - visible width.
              for (let i = nextIndex; i >= 0; i--) {
                if (visibleWidth >= offset) {
                  nextIndex = i
                }
                offset += itemRects[i].width
              }
              offset -= visibleWidth
            } else {
              // Currently onscreen, just need to find the currentIndex.
              offset = currentOffset
              for (let i = nextIndex - 1; i >= 0; i--) {
                if (itemRects[i].left >= visibleLeft) {
                  nextIndex = i
                }
              }
            }
          }
        } else if (typeof target === 'number') {
          nextIndex = target
          let menuWidth = 0
          for (let i = itemRects.length - 1; i >= 0; i--) {
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
          offset = scrollState.offset
        }

        // Set the actual scroll offset on the list.
        if (offset !== currentOffset) {
          list[scrollOffset] = offset
        } else if (
          offset === scrollState.offset &&
          scrollState.showScroll &&
          nextIndex === scrollState.currentIndex
        ) {
          // If the offset/index state is unchanged, don't update the state.
          return scrollState
        }
        const result: Scroll = {
          offset,
          showScroll: true,
          currentIndex: nextIndex,
        }
        if (buttonWidth && visibleWidth < scrollWidth - offset) {
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

      const onFocus = ({ target }: FocusEvent) => {
        setScroll((s) => updateScrollState(s, target as HTMLElement))
      }
      list.addEventListener('focusin', onFocus)
      const observer = observeRect(list, () => setScroll(updateScrollState))
      observer.observe()
      return () => {
        observer.unobserve()
        list.removeEventListener('focusin', onFocus)
      }
    }
  }, [isVisible, listRef, orientation, getScrollInfo])
  return [listRef, scroll]
}

export const BUTTON_WIDTH = 34 // 16 margin, 18 icon
export const ScrollButton = styled.div.attrs((p) => ({
  'aria-disabled': !p.onClick || undefined,
  'aria-hidden': true,
}))`
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
  cursor: pointer;
  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }
  &[aria-disabled] {
    cursor: not-allowed;
    color: ${(p) => p.theme.colors.lightGray};
  }
  svg {
    width: 18px;
    height: 18px;
    margin: 8px;
  }
`
