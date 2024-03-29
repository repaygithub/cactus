import React from 'react'

import { isActionKey, preventAction } from './a11y'
import { FocusControl, FocusHint, FocusOpts, FocusSetter, useFocusControl } from './focus'
import { useBox, useStateWithCallback } from './react'
import useId from './useId'

export type PopupType = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

export type TogglePopup = (expand?: boolean, f?: FocusHint, opt?: FocusOpts) => void
export type PositionPopup = (popup: HTMLElement, button: HTMLElement | null) => void

interface PopupOpts {
  id?: string
  popupId?: string
  buttonId?: string
  onWrapperBlur?: (e: React.FocusEvent<HTMLElement>, t: TogglePopup) => void
  onWrapperKeyDown?: (e: React.KeyboardEvent<HTMLElement>, t: TogglePopup) => void
  onButtonClick?: (e: React.MouseEvent<HTMLElement>, t: TogglePopup) => void
  onButtonKeyDown?: (e: React.KeyboardEvent<HTMLElement>, t: TogglePopup) => void
  initialExpanded?: boolean
  /** Called whenever the popup is expanded, can be used to alter the popup styles. */
  positionPopup?: PositionPopup
  /** Utilized via `useFocusControl`; to disable focus control, pass a noop function. */
  focusControl?: FocusControl
  /**
   * If `true`, clicking the button to expand the popup will cause focus to
   * enter the popup at `focusIndex` 0. Defaults to false, except for "dialog"
   * popups which default to true. (Note that triggering the button using key
   * press enter/spacebar will always enter focus, regardless of this setting.)
   */
  focusOnClickExpand?: boolean
}

interface UsePopup {
  expanded: boolean
  toggle: TogglePopup
  setFocus: FocusSetter
  popupProps: React.HTMLAttributes<HTMLElement>
  buttonProps: React.HTMLAttributes<HTMLElement>
  wrapperProps: React.HTMLAttributes<HTMLElement>
}

function usePopup(
  popupType: PopupType,
  {
    id,
    popupId: inputPopupId,
    buttonId: inputButtonId,
    onWrapperBlur,
    onWrapperKeyDown,
    onButtonClick,
    onButtonKeyDown,
    positionPopup,
    focusControl,
    initialExpanded = false,
    focusOnClickExpand = popupType === 'dialog',
  }: PopupOpts = {}
): UsePopup {
  const buttonId = useId(inputButtonId || (id && `${id}-button`))
  const popupId = useId(inputPopupId || (id && `${id}-popup`))
  const setFocus = useFocusControl(focusControl, popupId)
  const [expanded, setExpanded] = useStateWithCallback<boolean>(initialExpanded)
  const box = useBox({ expanded, setFocus })

  // For convenience, you can control focus & visibility with a single call.
  const toggle = React.useCallback<TogglePopup>(
    (expand, focusHint, focusOpt) => {
      let isExpanded = box.expanded
      const shouldUpdateState = expand !== isExpanded

      if (shouldUpdateState) {
        isExpanded = !isExpanded
      }

      // A closed element can't focus by index or text search.
      if (!isExpanded && typeof focusHint !== 'object') {
        focusHint = null
      }

      if (shouldUpdateState) {
        setExpanded(isExpanded, () => {
          if (focusHint !== undefined) {
            box.setFocus(focusHint, focusOpt)
          }
        })
      } else if (focusHint !== undefined) {
        box.setFocus(focusHint, focusOpt)
      }
    },
    [box, setExpanded]
  )

  React.useLayoutEffect(() => {
    if (positionPopup && expanded) {
      const button = document.getElementById(buttonId)
      const popup = document.getElementById(popupId)
      if (popup) {
        positionPopup(popup, button)
      }
    }
  }, [positionPopup, expanded, buttonId, popupId])

  const closeOnBlur = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (onWrapperBlur) {
        onWrapperBlur(event, toggle)
      }
      // Although blur events aren't cancelable, you can use `preventDefault()`
      // in this case to prevent the `usePopup`'s default behavior.
      if (!event.isDefaultPrevented()) {
        const wrapper = event.currentTarget
        setTimeout(() => {
          if (!wrapper.contains(document.activeElement)) {
            toggle(false)
          }
        }, 50)
      }
    },
    [toggle, onWrapperBlur]
  )

  const handleCloseKey = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Escape') {
        const button = document.getElementById(buttonId)
        if (button?.getAttribute?.('aria-expanded') === 'true') {
          event.stopPropagation()
          toggle(false, button)
        }
      }
      if (onWrapperKeyDown) {
        onWrapperKeyDown(event, toggle)
      }
    },
    [toggle, buttonId, onWrapperKeyDown]
  )

  const toggleOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onButtonClick) {
        onButtonClick(event, toggle)
      }
      if (!event.isDefaultPrevented()) {
        toggle(undefined, focusOnClickExpand ? 0 : undefined)
      }
    },
    [toggle, onButtonClick, focusOnClickExpand]
  )

  const toggleOnKey = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (onButtonKeyDown) {
        onButtonKeyDown(event, toggle)
      }
      if (!event.isDefaultPrevented() && isActionKey(event)) {
        event.preventDefault()
        toggle(undefined, 0)
      }
    },
    [toggle, onButtonKeyDown]
  )

  const wrapperProps = {
    id,
    role: 'none',
    // This is needed for closeOnBlur to work on Safari.
    tabIndex: -1,
    onBlur: closeOnBlur,
    onKeyDown: handleCloseKey,
  }
  const popupProps = {
    id: popupId,
    tabIndex: -1,
    role: popupType,
    'aria-labelledby': buttonId,
    'aria-hidden': !expanded || undefined,
  }
  const buttonProps = {
    id: buttonId,
    role: 'button',
    'aria-haspopup': popupType,
    'aria-controls': popupId,
    'aria-expanded': expanded || undefined,
    onClick: toggleOnClick,
    onKeyDown: toggleOnKey,
    onKeyUp: preventAction,
  }

  return { expanded, toggle, setFocus, wrapperProps, buttonProps, popupProps }
}

export default usePopup
