import React from 'react'

import { useBox } from './react'

type FocusList = HTMLElement[]

const FOCUS_SELECTOR =
  'a[href]:not([href=""]):not([rel="ignore"]):not(:disabled),' +
  'input:not([hidden]):not([type="hidden"]):not([type="file"]):not(:disabled),' +
  'button:not(:disabled),' +
  'select:not(:disabled),' +
  'textarea:not(:disabled)' +
  '[tabindex]'

export function getFocusable(root?: Element | Document): FocusList {
  let searchFrom: Element | Document
  if (root && root instanceof Element) {
    searchFrom = root
  } else {
    searchFrom = document
  }
  const result = Array.from(searchFrom.querySelectorAll<HTMLElement>(FOCUS_SELECTOR))
  return result.filter((el) => !(el.hasAttribute('tabindex') && el.tabIndex < 0))
}

type RootHint = HTMLElement | string | null
export type FocusHint = HTMLElement | string | number | null

interface FocusState {
  focusHint: FocusHint
  focusIndex: number
  shift: boolean
  control: FocusControl
}

export interface SearchState {
  focusHint: string | number
  focusIndex: number
  shift: boolean
}

export interface FocusOpts {
  shift?: boolean
  /** Allow overriding on a per-call basis. */
  control?: FocusControl
}

/**
 * This is used when focus needs to enter the root, in one of two ways:
 *   1. It can return a list of elements, and the `focus()` method will be
 *      called on the one at `focusIndex` (accounting for negative indexes).
 *   2. It can return a single element.
 *   3. It can also return `undefined` to do nothing.
 *
 * The default returns a list of all focusable elements in the popup.
 */
export type FocusControl = (
  root: HTMLElement,
  state: SearchState
) => FocusList | HTMLElement | undefined
export type FocusSetter = (f: FocusHint, opts?: FocusOpts) => void

const initialState = (control: FocusControl): FocusState => ({
  focusHint: null,
  focusIndex: -1,
  shift: false,
  control,
})

// If they pass the ID, then presumably they don't need the ref.
export function useFocusControl(fc: FocusControl | undefined, rootId: string): FocusSetter
export function useFocusControl(fc?: FocusControl): [FocusSetter, React.RefObject<HTMLElement>]
export function useFocusControl(focusControl: FocusControl = getFocusable, rootId?: string): any {
  const focusRootRef = React.useRef<RootHint>(rootId || null)
  const focusState = React.useRef(initialState(focusControl))
  const box = useBox({ focusState, focusControl })

  const setFocus = React.useCallback<FocusSetter>(
    (focusHint, opts = {}) => {
      const { focusState, focusControl } = box
      const { shift = false, control = focusControl } = opts
      // Modify in-place to prevent re-render; in truth, we treat this more
      // like a ref than state, but `delay` is easier to implement this way.
      focusState.current.focusHint = focusHint
      focusState.current.shift = shift
      focusState.current.control = control
      applyFocusState(focusState.current, focusRootRef.current)
    },
    [box, focusRootRef]
  )

  return rootId ? setFocus : [setFocus, focusRootRef as React.RefObject<HTMLElement>]
}

function applyFocusState(state: FocusState, focusRoot: RootHint) {
  const root = getRoot(focusRoot)
  const { focusHint, control: focusControl } = state

  let focusElement: HTMLElement | undefined
  let focusIndex = -1
  if (focusHint instanceof HTMLElement) {
    focusElement = focusHint
  } else if (focusHint !== null && root && root.getAttribute('aria-hidden') !== 'true') {
    const focus = focusControl(root, state as SearchState)
    if (focus !== undefined) {
      focusIndex = state.focusIndex // Preserve whatever the control did to it.
    }
    if (focus instanceof HTMLElement) {
      focusElement = focus
    } else if (focus?.length) {
      const nextIndex = getFocusIndex(focus, state as SearchState)
      if (nextIndex !== undefined) {
        focusIndex = wrapIndex(nextIndex, focus.length)
        focusElement = focus[focusIndex]
      }
    }
  }

  state.focusIndex = focusIndex
  if (focusElement && focusElement !== document.activeElement) {
    focusElement.focus()
  }
}

const getRoot = (rootHint: RootHint) =>
  typeof rootHint === 'string' ? document.getElementById(rootHint) : rootHint

export function getCurrentFocusIndex(focusList: FocusList, fallback: number): number {
  // If we can get information from the DOM, use that instead of stored state.
  const currentIndex = focusList.indexOf(document.activeElement as HTMLElement)
  return currentIndex < 0 ? fallback : currentIndex
}

export function getFocusIndex(
  focusList: FocusList,
  { focusHint, focusIndex, shift }: SearchState
): number | undefined {
  focusIndex = getCurrentFocusIndex(focusList, focusIndex)
  if (typeof focusHint === 'string') {
    return findIndexByTextContent(focusList, focusHint, focusIndex)
  } else if (shift && focusIndex < 0) {
    // A +1 shift should go to the first element (index 0), but for 0/negative
    // shifts treating it as relative to the start of the list is fine.
    return focusHint > 0 ? focusHint - 1 : focusHint
  }
  return shift ? focusIndex + focusHint : focusHint
}

export function wrapIndex(focusIndex: number, focusCount: number): number {
  focusIndex = focusIndex % focusCount
  if (focusIndex < 0) {
    focusIndex += focusCount
  }
  return focusIndex
}

const PRINTABLE = /^\S+$/
export function findIndexByTextContent(
  focusList: FocusList,
  focusHint: string,
  currentIndex: number
): number | undefined {
  if (PRINTABLE.test(focusHint)) {
    currentIndex = Math.max(0, currentIndex)
    const pattern = new RegExp(`^${focusHint}`, 'iu')
    for (let i = 0; i < focusList.length; i++) {
      // Start the search at the current index and wrap around if needed.
      const index = i + currentIndex
      const text = focusList[index % focusList.length].textContent
      if (text && pattern.test(text)) {
        return index
      }
    }
  }
}
