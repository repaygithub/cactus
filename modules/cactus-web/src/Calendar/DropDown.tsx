import { NavigationChevronDown } from '@repay/cactus-icons'
import { border, color, colorStyle, insetBorder, textStyle } from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'

import { keyDownAsClick, LiveRegion } from '../helpers/a11y'
import { useScrollTrap } from '../helpers/scroll'
import usePopup, { TogglePopup } from '../helpers/usePopup'

interface Option {
  value: number
  label: string
}

interface DropDownProps extends React.AriaAttributes {
  className?: string
  label: string | number
  value: number
  options: number[] | Option[]
  onSelectOption: (value: number, e: React.SyntheticEvent) => void
  liveKey?: React.Key
}

const getFocusHint = (e: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) => {
  let focusHint = 0
  switch (e.key) {
    case 'Home':
      toggle(true, 0)
      break
    case 'End':
      toggle(true, -1)
      break

    case 'PageUp':
      focusHint = -7
      break
    case 'PageDown':
      focusHint = 7
      break

    case 'ArrowUp':
      focusHint = -1
      break
    case 'ArrowDown':
      focusHint = 1
      break

    default:
      return
  }
  e.preventDefault()
  e.stopPropagation()
  return focusHint
}

const positionPopup = (popup: HTMLElement) => {
  let header = popup
  while ((header = header.parentElement as HTMLElement)) {
    if (header.parentElement?.getAttribute('role') === 'group') {
      const headerHeight = header.offsetHeight
      const popupHeight = header.parentElement.clientHeight - headerHeight
      let item = popup.firstElementChild
      const itemHeight = item?.clientHeight ?? 35
      let itemMiddle = itemHeight >> 1
      while (item && item.getAttribute('aria-selected') !== 'true') {
        item = item.nextElementSibling
        itemMiddle += itemHeight
      }
      popup.style.top = `${headerHeight}px`
      popup.scrollTop = itemMiddle - popupHeight / 2
      return
    }
  }
}

const focusControl = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>('li'))

const DropDownBase = ({
  className,
  label,
  value,
  options,
  onSelectOption,
  liveKey,
  ...props
}: DropDownProps) => {
  const popupRef = React.useRef<HTMLUListElement>(null)
  useScrollTrap(popupRef)
  const { wrapperProps, popupProps, buttonProps, expanded, toggle } = usePopup('listbox', {
    focusControl,
    positionPopup,
  })

  const closeOnEscape = wrapperProps.onKeyDown
  wrapperProps.onKeyDown = (e) => {
    closeOnEscape?.(e)
    keyDownAsClick(e)
    if (e.isDefaultPrevented()) return

    const focusHint = getFocusHint(e, toggle)
    if (focusHint) {
      if (expanded) {
        toggle(true, focusHint, { shift: true })
      } else {
        const item = popupRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
        toggle(true, item)
      }
    }
  }

  buttonProps['aria-describedby'] = props['aria-labelledby']
  delete buttonProps.onKeyDown // Handled at the wrapper level.
  buttonProps.onClick = () => {
    const selected = popupRef.current?.querySelector('[aria-selected="true"]')
    toggle(undefined, selected as HTMLElement)
  }

  popupProps.children = options.map((opt: number | Option) => {
    const optProps =
      typeof opt === 'object'
        ? { key: opt.value, children: <span>{opt.label}</span> }
        : { key: opt, children: <span>{opt}</span> }
    return (
      <li
        {...optProps}
        tabIndex={-1}
        role="option"
        data-value={optProps.key}
        aria-selected={optProps.key === value || undefined}
      />
    )
  })
  popupProps.onClick = (e: React.MouseEvent<HTMLElement>) => {
    let target = e.target as HTMLElement
    if (!target.matches('[data-value]')) {
      target = target.parentElement as HTMLElement
    }
    if (target.dataset.value) {
      toggle(false, e.currentTarget.previousElementSibling as HTMLElement)
      onSelectOption(parseInt(target.dataset.value), e)
    }
  }
  return (
    <div {...wrapperProps} className={className}>
      {liveKey && <LiveRegion value={label} changeKey={liveKey} />}
      <button type="button" {...buttonProps}>
        <span>{label}</span>
        <NavigationChevronDown iconSize="tiny" ml={3} />
      </button>
      <ul {...popupProps} {...props} ref={popupRef} />
    </div>
  )
}

const OUTLINE = { thin: '2px' }
const DropDown = styled(DropDownBase)`
  button {
    appearance: none;
    background-color: transparent;
    border: none;
    outline: none
    padding: 0 4px;
    ${textStyle('h4')}
    :focus-visible {
      outline: 2px solid black;
    }
  }

  [aria-expanded] {
    color: ${color('callToAction')};
    svg {
      transform: scaleY(-1);
    }
  }

  ul {
    overflow-y: scroll;
    position: absolute;
    z-index: 1;
    top: 62px;
    bottom: 0;
    left: 0;
    right: 0;
    list-style: none;
    padding: 0;
    margin: 0;
    outline: none;
    background-color: ${color('lightContrast')};
  }

  [aria-hidden='true'] {
    display: none;
  }

  li {
    width: 100%;
    text-align: center;
    cursor: pointer;
    padding: 4px 0;
    outline: none;

    span {
      padding: 4px;
      border-radius: 4px;
    }

    &:hover span,
    &:focus span {
      background-color: ${color('lightCallToAction')};
    }

    &:focus-visible span {
      background-color: transparent;
      border: ${border('callToAction', OUTLINE)};
    }

    &[aria-selected='true'] span {
      ${colorStyle('callToAction')}
    }

    &[aria-selected='true']:focus-visible span {
      ${insetBorder('white', undefined, OUTLINE)};
    }
  }
`

export default DropDown
