import { NavigationChevronDown } from '@repay/cactus-icons'
import { border, color, colorStyle, radius, textStyle } from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'

import { keyDownAsClick } from '../helpers/a11y'
import { useScrollTrap } from '../helpers/scroll'
import usePopup, { TogglePopup } from '../helpers/usePopup'

interface Option {
  value: number
  label: string
}

interface DropDownProps extends React.AriaAttributes {
  label: string | number
  value: number
  options: number[] | Option[]
  onSelectOption: (value: number, e: React.SyntheticEvent) => void
}

const onWrapperKeyDown = (e: React.KeyboardEvent<HTMLElement>, toggle: TogglePopup) => {
  keyDownAsClick(e)
  if (e.isDefaultPrevented()) return

  let focusHint = 1
  switch (e.key) {
    case 'Home':
    case 'PageUp':
      toggle(true, 0)
      break
    case 'End':
    case 'PageDown':
      toggle(true, -1)
      break

    case 'ArrowUp':
      focusHint = -1
    case 'ArrowDown':
      const button = e.currentTarget.firstElementChild
      if (button?.getAttribute('aria-expanded') === 'true') {
        toggle(true, focusHint, { shift: true })
      } else {
        let item = button?.nextElementSibling?.firstElementChild
        while (item) {
          if (item.getAttribute('aria-selected') === 'true') {
            toggle(true, item as HTMLElement)
            break
          }
          item = item.nextElementSibling
        }
      }
      break
    default:
      return
  }
  e.stopPropagation()
}

const positionPopup = (popup: HTMLElement) => {
  let header = popup
  while ((header = header.parentElement as HTMLElement)) {
    if (header.parentElement?.getAttribute('role') === 'group') {
      popup.style.top = `${header.offsetHeight}px`
      break
    }
  }
}

const DropDownBase = ({ label, value, options, onSelectOption, ...props }: DropDownProps) => {
  const { wrapperProps, popupProps, buttonProps, toggle } = usePopup('listbox', {
    positionPopup,
    onWrapperKeyDown,
  })
  buttonProps['aria-labelledby'] = `${props['aria-labelledby']} ${buttonProps.id}`
  delete buttonProps.onKeyDown // Handled at the wrapper level.
  buttonProps.onClick = (e: React.MouseEvent<HTMLElement>) => {
    const selected = e.currentTarget.nextElementSibling?.querySelector('[aria-selected="true"]')
    toggle(undefined, selected as HTMLElement)
  }

  popupProps.children = options.map((opt: number | Option) => {
    const props =
      typeof opt === 'object'
        ? { key: opt.value, children: <span>{opt.label}</span> }
        : { key: opt, children: <span>{opt}</span> }
    return (
      <li
        {...props}
        tabIndex={-1}
        role="option"
        data-value={props.key}
        aria-selected={props.key === value || undefined}
      />
    )
  })
  popupProps.onClick = (e: React.MouseEvent<HTMLElement>) => {
    let target = e.target as HTMLElement
    if (target.matches('span')) {
      target = target.parentElement as HTMLElement
    }
    if (target.dataset.value) {
      toggle(false, e.currentTarget.previousElementSibling as HTMLElement)
      onSelectOption(parseInt(target.dataset.value), e)
    }
  }
  const popupRef = React.useRef<HTMLUListElement>(null)
  useScrollTrap(popupRef)
  return (
    <div {...wrapperProps}>
      <button type="button" {...buttonProps}>
        <span>{label}</span>
        <NavigationChevronDown iconSize="tiny" ml={3} />
      </button>
      <ul {...popupProps} {...props} ref={popupRef} />
    </div>
  )
}

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

  [aria-expanded]
    color: ${color('callToAction')};
    svg {
      transform: scaleY(-1);
    }
  }

  ul {
    overflow-y: scroll;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    list-style: none;
    padding: 0;
    margin: 0;
    outline: none;
    border: 2px solid transparent;
    border-radius: ${radius(16, 0.6)};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: ${color('lightContrast')};

    &:focus-within {
      border-color: ${color('callToAction')};
    }
  }

  li {
    width: 100%;
    text-align: center;
    cursor: pointer;
    padding: 4px 0;

    span {
      padding: 4px;
      border-radius: 4px;
    }

    &:hover span {
      background-color: ${color('lightCallToAction')};
    }

    &:focus-visible span {
      outline: ${border('darkContrast')};
    }

    &[aria-selected='true'] > span {
      ${colorStyle('callToAction')}
    }
  }
`

export default DropDown
