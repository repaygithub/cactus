import React, { useLayoutEffect, useRef, useState } from 'react'

import '../helpers/polyfills'
import { CactusTheme } from '@repay/cactus-theme'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { getScrollX, getScrollY } from '../helpers/scrollOffset'
import { margin, MarginProps } from 'styled-system'
import { NavigationChevronDown, NavigationClose } from '@repay/cactus-icons'
import { omitMargins } from '../helpers/omit'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'
import { width, WidthProps } from 'styled-system'
import CheckBox from '../CheckBox/CheckBox'
import handleEvent from '../helpers/eventHandler'
import KeyCodes from '../helpers/keyCodes'
import Portal from '@reach/portal'
import PropTypes from 'prop-types'
import Rect from '@reach/rect'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type SelectValueType = string | number | Array<string | number> | null
export type OptionType = { label: string; value: string | number }

type ExtendedOptionType = OptionType & { id: string; isSelected: boolean }

export interface SelectProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref' | 'onChange' | 'onBlur' | 'onFocus'
    > {
  options: Array<OptionType | string | number>
  id: string
  name: string
  value?: string | number | Array<string | number> | null
  placeholder?: string
  className?: string
  /** !important */
  disabled?: boolean
  multiple?: boolean
  /**
   * Used when there are multiple selected, but too many to show. place '{}' to insert unshown number in label
   */
  extraLabel?: string
  status?: Status
  onChange?: FieldOnChangeHandler<SelectValueType>
  onBlur?: FieldOnBlurHandler
  onFocus?: FieldOnFocusHandler
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${p => p.theme.colors.success};
    background: ${p => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${p => p.theme.colors.warning};
    background: ${p => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${p => p.theme.colors.error};
    background: ${p => p.theme.colors.transparentError};
  `,
}

const displayStatus = (props: SelectProps) => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  }
}

const ValueTagBase = React.forwardRef<
  HTMLSpanElement,
  {
    id?: string
    className?: string
    closeOption?: boolean
    children: React.ReactNode
    hidden?: boolean
  }
>(({ id, className, closeOption, children }, ref) => {
  return (
    <span id={id} ref={ref} className={className}>
      <span className="value-tag__label">{children}</span>
      {closeOption && <NavigationClose data-role="close" />}
    </span>
  )
})

const ValueTag = styled(ValueTagBase)`
  box-sizing: border-box;
  ${p => p.theme.textStyles.small};
  padding: 0 8px 0 8px;
  border: 1px solid ${p => p.theme.colors.lightGray};
  border-radius: 7px;
  margin-right: 2px;
  display: inline-block;
  height: 24px;
  ${p => (p.hidden ? { visibility: 'hidden' } : undefined)}

  ${NavigationClose} {
    appearance: none;
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 8px;
    padding: 4px;
    margin-left: 12px;
    vertical-align: -3px;
  }
`

function isElement(el?: any): el is HTMLElement {
  return el && el.nodeType === 1
}

function doesChildOverflow(parentRect: ClientRect, childRect: ClientRect) {
  return childRect.left + childRect.width > parentRect.left + parentRect.width
}

function willTruncateBlockShow(
  parentRect: ClientRect,
  childRect: ClientRect,
  truncateRect: ClientRect
) {
  return parentRect.left + parentRect.width >= childRect.left + truncateRect.width
}

const ValueSwitch = (props: {
  options: ExtendedOptionType[]
  placeholder: string | undefined
  extraLabel: string
  multiple?: boolean
}) => {
  const selected = props.options.filter(o => o.isSelected)
  const numSelected = selected.length
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const moreRef = useRef<HTMLSpanElement | null>(null)
  const [numToRender, setNum] = useState(numSelected)
  const [prevValue, setPrevValue] = useState<string>('')
  const valueString = selected.reduce((m, o) => m + o.label, '')
  const shouldRenderAll = prevValue !== valueString
  /**
   * finds the maximum number of values it can display
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (spanRef.current !== null && moreRef.current !== null && shouldRenderAll) {
      setPrevValue(valueString)
      let parentRect = spanRef.current.getBoundingClientRect()
      let numberChildren = spanRef.current.childNodes.length
      let index =
        numToRender < numberChildren && isElement(spanRef.current.childNodes[numToRender])
          ? numToRender
          : 0
      let child: any = spanRef.current.childNodes[index] as HTMLElement
      let childRect = child.getBoundingClientRect()
      let direction = doesChildOverflow(parentRect, childRect) ? -1 : 1
      const moreRect = moreRef.current.getBoundingClientRect()
      while (index >= 0 && index < numberChildren) {
        child = spanRef.current.childNodes[index]
        if (isElement(child)) {
          childRect = child.getBoundingClientRect()
          if (direction === -1) {
            if (willTruncateBlockShow(parentRect, childRect, moreRect)) {
              setNum(index)
              return
            }
          } else if (doesChildOverflow(parentRect, childRect)) {
            if (willTruncateBlockShow(parentRect, childRect, moreRect)) {
              setNum(index)
            } else {
              setNum(index - 1)
            }
            return
          }
        }
        index += direction
      }
      setNum(numberChildren)
    }
  }, [numToRender, shouldRenderAll, valueString])

  if (numSelected === 0) {
    return <Placeholder>{props.placeholder}</Placeholder>
  } else if (props.multiple) {
    if (numSelected > 1) {
      return (
        <ValueSpan ref={spanRef}>
          {selected.slice(0, shouldRenderAll ? undefined : numToRender).map(opt => (
            <ValueTag id={`value-tag::${opt.id}`} closeOption key={opt.value + opt.label}>
              {opt.label}
            </ValueTag>
          ))}
          <ValueTag ref={moreRef} hidden={numToRender >= numSelected || shouldRenderAll}>
            {props.extraLabel.replace(/\{\}/, String(numSelected - numToRender))}
          </ValueTag>
        </ValueSpan>
      )
    } else {
      const value = selected[0]
      return (
        <ValueSpan>
          <ValueTag id={`value-tag::${value.id}`} closeOption>
            {value.label}
          </ValueTag>
        </ValueSpan>
      )
    }
  } else {
    return <ValueSpan>{selected[0].label}</ValueSpan>
  }
}

const ValueSpan = styled.span`
  display: inline-block;
  font-size: ${p => p.theme.fontSizes.p}px;
  white-space: nowrap;
  max-width: 100%;
`

const Placeholder = styled.span`
  font-style: italic;
  color: ${p => p.theme.colors.darkContrast};
  font-size: ${p => p.theme.fontSizes.p}px;
`

const SelectTrigger = styled.button`
  position: relative;
  box-sizing: border-box;
  min-width: 194px;
  width: 100%;
  height: 32px;
  padding: 0 24px 0 16px;
  background-color: transparent;
  border-radius: 20px;
  border-width: 1px;
  border-style: solid;
  border-color: ${p => p.theme.colors.darkContrast};
  text-align: left;
  outline: none;
  appearance: none;
  cursor: pointer;

  :disabled {
    border-color: ${p => p.theme.colors.mediumGray};
    color: ${p => p.theme.colors.mediumGray};
    cursor: not-allowed;

    ${Placeholder} {
      display: none;
    }
  }

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus,
  &[aria-expanded] {
    border-color: ${p => p.theme.colors.callToAction};

    ${NavigationChevronDown} {
      color: ${p => p.theme.colors.callToAction};
    }
  }

  &[aria-expanded] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
  }

  ${NavigationChevronDown} {
    position: absolute;
    right: 14px; // 14 + 2px from border
    top: 10px;
  }
`

const StyledList = styled.ul`
  position: absolute;
  box-sizing: border-box;
  z-index: 100;
  max-height: 400px;
  max-width: 100vw;
  padding: 8px 0;
  margin-top: 0;
  overflow-y: auto;
  outline: none;
  border-radius: 8px;
  box-shadow: 0 3px 9px 0 rgba(7, 61, 232, 0.28), 0 3px 8px 0 rgba(17, 51, 159, 0.07),
    0 3px 9px 0 rgba(7, 61, 232, 0.28), 0 3px 8px 0 rgba(17, 51, 159, 0.07);
  background-color: ${p => p.theme.colors.white};
`

const Option = styled.li`
  cursor: pointer;
  display: list-item;
  border: none;
  height: auto;
  ${p => p.theme.textStyles.small};
  text-align: left;
  box-shadow: none;
  padding: 4px 16px;

  &.highlighted-option {
    background-color: ${p => p.theme.colors.callToAction};
    color: ${p => p.theme.colors.callToActionText};

    // haxors
    ${CheckBox} > input:not(:checked) + span {
      border-color: white;
    }
  }

  ${CheckBox} {
    pointer-events: none;
    margin-right: 4px;
    vertical-align: -2px;
  }
`

interface ListProps {
  isOpen: boolean
  options: ExtendedOptionType[]
  multiple?: boolean
  onBlur: (event: React.FocusEvent<HTMLUListElement>) => void
  onClick: (event: React.MouseEvent<HTMLUListElement>) => void
  raiseChange: (active: OptionType | null, noToggle?: boolean) => void
  onClose: () => void
  triggerRect: DOMRect | undefined
}

interface ListState {
  activeDescendant: string
}

class List extends React.Component<ListProps, ListState> {
  state = {
    activeDescendant: '',
  }
  listRef: HTMLUListElement | null = null

  pendingChars: string = ''
  keyClear: number | undefined
  searchIndex: number = 0
  scrollClear: number | undefined
  didScroll: boolean = false

  /** Start List event handlers */

  handleBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    this.setState({ activeDescendant: '' })
    this.props.onBlur(event)
  }

  handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const key = event.which || event.keyCode
    const active = this.getActiveOpt()
    const options = this.props.options
    if (active === null || options.length === 0) {
      return
    }
    let nextIndex = getSelectedIndex(options, active.value)

    switch (key) {
      case KeyCodes.UP:
      case KeyCodes.DOWN: {
        event.preventDefault()
        if (key === KeyCodes.UP) {
          --nextIndex
        } else {
          ++nextIndex
        }

        if (nextIndex <= 0) {
          this.setState({ activeDescendant: options[0].id })
        } else if (nextIndex >= options.length - 1) {
          this.setState({
            activeDescendant: options[options.length - 1].id,
          })
        } else {
          this.setState({ activeDescendant: options[nextIndex].id })
        }

        break
      }
      case KeyCodes.HOME: {
        event.preventDefault()
        this.setState({ activeDescendant: options[0].id })
        break
      }
      case KeyCodes.END:
        event.preventDefault()
        this.setState({
          activeDescendant: options[options.length - 1].id,
        })
        break
      case KeyCodes.SPACE:
        event.preventDefault()
        if (this.props.multiple) {
          this.props.raiseChange(active)
        }
        break
      case KeyCodes.RETURN: {
        event.preventDefault()
        this.setState({ activeDescendant: '' })
        this.props.raiseChange(active, true)
        this.props.onClose()
        break
      }
      case KeyCodes.ESC: {
        event.preventDefault()
        this.setState({ activeDescendant: '' })
        this.props.onClose()
        break
      }
      default:
        // type to search
        const option = this.findOptionToFocus(key)
        if (option !== null) {
          this.setState({ activeDescendant: option.id })
        }
        break
    }
  }

  handleOptionMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
    const currentTarget = event.currentTarget
    // prevent triggering by automated scrolling
    if (!this.didScroll) {
      this.setState({ activeDescendant: currentTarget.id as string })
    }
  }

  /** End List event handlers */
  /** Start List helpers */

  focus = () => {
    this.listRef !== null && this.listRef.focus()
  }

  isList = (node: HTMLElement | null) => this.listRef === node

  getActiveOpt() {
    const activeDescendant = this.state.activeDescendant
    if (activeDescendant === '') {
      return null
    }
    return this.props.options.find(o => o.id === activeDescendant) || null
  }

  findOptionToFocus(key: number) {
    const character = String.fromCharCode(key)
    const options = this.props.options
    let selected = this.getActiveOpt()
    if (!this.pendingChars && selected !== null) {
      this.searchIndex = getSelectedIndex(this.props.options, selected.value)
    }
    this.pendingChars += character
    let nextMatch = findMatchInRange(
      options,
      this.pendingChars,
      this.searchIndex + 1,
      options.length
    )
    if (nextMatch === null) {
      nextMatch = findMatchInRange(options, this.pendingChars, 0, this.searchIndex)
    }
    if (this.keyClear) {
      clearTimeout(this.keyClear)
      this.keyClear = undefined
    }
    this.keyClear = setTimeout(() => {
      this.pendingChars = ''
      this.keyClear = undefined
    }, 500)
    return nextMatch
  }

  scrolled = () => {
    this.didScroll = true
    clearTimeout(this.scrollClear)
    this.scrollClear = setTimeout(() => {
      this.didScroll = false
    }, 150) // 120ms worked on Firefox and IE11 so 150 is just extra safe
  }

  static initActiveDescendant(options: ExtendedOptionType[]) {
    let activeId = ''
    const selected = options.find(o => o.isSelected)
    if (selected) {
      activeId = selected.id
    } else if (options.length) {
      activeId = options[0].id
    }
    return activeId
  }

  /** End List helpers */

  static getDerivedStateFromProps(props: ListProps, state: ListState) {
    if (props.isOpen && state.activeDescendant === '') {
      return { activeDescendant: List.initActiveDescendant(props.options) }
    } else if (!props.isOpen && state.activeDescendant !== '') {
      return { activeDescendant: '' }
    }
    return null
  }

  componentDidUpdate() {
    if (this.props.isOpen) {
      window.requestAnimationFrame(() => {
        let listEl = this.listRef
        let activeDescendant = this.state.activeDescendant

        if (listEl === null || activeDescendant === '') {
          return
        }
        let optionEl: HTMLElement | null = document.getElementById(activeDescendant)
        if (optionEl === null) {
          return
        }
        if (listEl.scrollHeight > listEl.clientHeight) {
          var scrollBottom = listEl.clientHeight + listEl.scrollTop
          var optionBottom = optionEl.offsetTop + optionEl.offsetHeight
          if (optionBottom > scrollBottom) {
            listEl.scrollTop = optionBottom - listEl.clientHeight
            this.scrolled()
          } else if (optionEl.offsetTop < listEl.scrollTop) {
            listEl.scrollTop = optionEl.offsetTop
            this.scrolled()
          }
        }
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollClear)
    clearTimeout(this.keyClear)
  }

  render() {
    const { isOpen, multiple, triggerRect, options } = this.props
    const { activeDescendant } = this.state

    return (
      <Portal>
        <Rect observe={isOpen}>
          {({ ref: listRef, rect: listRect }) => {
            const mergeRefs = (n: HTMLUListElement | null) => {
              this.listRef = n
              listRef(n)
            }
            return (
              <StyledList
                onBlur={this.handleBlur}
                onClick={this.props.onClick}
                onKeyDown={this.handleKeyDown}
                role="listbox"
                tabIndex={-1}
                ref={mergeRefs}
                style={positionList(isOpen, triggerRect, listRect)}
                aria-activedescendant={activeDescendant || undefined}
              >
                {options.map(opt => {
                  let optId = opt.id
                  let isSelected = opt.isSelected
                  let ariaSelected: boolean | 'true' | 'false' | undefined = isSelected || undefined
                  // multiselectable should have aria-select©ed on all options
                  if (multiple) {
                    ariaSelected = isSelected ? 'true' : 'false'
                  }
                  return (
                    <Option
                      id={optId}
                      key={optId}
                      className={activeDescendant === optId ? 'highlighted-option' : undefined}
                      data-value={opt.value}
                      role="option"
                      aria-selected={ariaSelected}
                      onMouseEnter={this.handleOptionMouseEnter}
                    >
                      {multiple && (
                        <CheckBox
                          id={`multiselect-option-check-${optId}`}
                          aria-hidden="true"
                          checked={isSelected}
                          readOnly
                          mr={2}
                        />
                      )}
                      {opt.label}
                    </Option>
                  )
                })}
              </StyledList>
            )
          }}
        </Rect>
      </Portal>
    )
  }
}

function findMatchInRange(
  options: ExtendedOptionType[],
  pendingChars: string,
  startIndex: number,
  endIndex: number
) {
  for (let i = startIndex; i < endIndex; ++i) {
    const opt = options[i]
    if (opt.label.toLowerCase().startsWith(pendingChars.toLowerCase())) {
      return opt
    }
  }
  return null
}

function asOption(opt: number | string | OptionType) {
  if (typeof opt === 'string') {
    return { label: opt, value: opt } as OptionType
  } else if (typeof opt === 'number') {
    return { label: String(opt), value: opt } as OptionType
  }
  return opt as OptionType
}

function getOptionId(selectId: string, option: OptionType) {
  return `${selectId}-${option.label}-${option.value}`.replace(/\s/g, '-')
}

function getSelectedIndex(options: Array<string | OptionType>, value: string | number): number {
  for (let i = 0; i < options.length; ++i) {
    const opt = options[i]
    if (
      (typeof opt === 'string' && opt === value) ||
      (typeof opt !== 'string' && opt.value === value)
    ) {
      return i
    }
  }

  return 0
}

const OFFSET = 8
const SCROLLBAR_WIDTH = 10
function positionList(
  isOpen: boolean,
  triggerRect: DOMRect | undefined,
  listRect: DOMRect | undefined
): React.CSSProperties | undefined {
  if (!isOpen || triggerRect === undefined) {
    return { visibility: 'hidden', display: 'none', height: 0, width: 0 }
  }
  const scrollY = getScrollY()
  const scrollX = getScrollX()

  // default assumes no collisions bottom
  let style: React.CSSProperties = {
    top: scrollY + triggerRect.top + triggerRect.height + OFFSET + 'px',
    left: scrollX + triggerRect.left + 'px',
    width: triggerRect.width + 'px',
  }
  if (listRect === undefined) {
    return style
  }

  const collisions = {
    top: triggerRect.top - listRect.height - OFFSET < 0,
    right: window.innerWidth < triggerRect.left + triggerRect.width,
    bottom: window.innerHeight < triggerRect.bottom + listRect.height,
    left: triggerRect.left < 0,
  }
  if (collisions.right && window.innerWidth < triggerRect.width) {
    collisions.left = true
  }

  if (collisions.bottom && !collisions.top) {
    style.top = scrollY + triggerRect.top - listRect.height - OFFSET + 'px'
  } else if (collisions.top && collisions.bottom) {
    style.top = scrollY + 'px'
    style.maxHeight = window.innerHeight - SCROLLBAR_WIDTH + 'px'
  }
  if (collisions.right && !collisions.left) {
    style.left = window.innerWidth + scrollX - listRect.width + 'px'
  } else if (collisions.left && !collisions.right) {
    style.left = scrollX + 'px'
  } else if (collisions.right && collisions.left) {
    style.left = scrollX + 'px'
    style.width = window.innerWidth - SCROLLBAR_WIDTH + 'px'
  }

  return style
}

type SelectState = {
  isOpen: boolean
  value: string | number | Array<number | string> | null
}

class SelectBase extends React.Component<SelectProps, SelectState> {
  state = {
    isOpen: false,
    value: this.props.value || null,
  }
  pendingChars: string = ''
  searchIndex: number = -1
  keyClear: number | undefined
  scrollClear: number | undefined
  listRef = React.createRef<List>()
  triggerRef = React.createRef<HTMLButtonElement>()

  static getDerivedStateFromProps(props: Readonly<SelectProps>, state: Readonly<SelectState>) {
    if (props.value !== undefined && props.value !== state.value) {
      let newState: Partial<SelectState> = { value: props.value }
      return newState
    }
    return null
  }

  componentWillUnmount() {
    clearTimeout(this.keyClear)
    clearTimeout(this.scrollClear)
  }

  /** END life-cycle methods */
  /** START event handlers */

  handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    const isNotControlledBlur = !event.relatedTarget || !this.isList(event.relatedTarget)
    if (isNotControlledBlur) {
      handleEvent(this.props.onBlur, this.props.name)
    }
  }

  handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    const isNotControlledFocus = !event.relatedTarget || !this.isList(event.relatedTarget)
    if (isNotControlledFocus) {
      handleEvent(this.props.onFocus, this.props.name)
    }
  }

  handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const key = event.which || event.keyCode

    switch (key) {
      case KeyCodes.UP:
      case KeyCodes.DOWN: {
        event.preventDefault()
        this.openList()
        break
      }
    }
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    let target: Element | null = event.target as HTMLElement
    // Get element from point if in IE
    if (/MSIE|Trident/.test(window.navigator.userAgent)) {
      target = document.elementFromPoint(event.clientX, event.clientY)
    }
    if (target && target.tagName === 'path') {
      target = target.closest('svg')
    }
    if (target && target.getAttribute('data-role') === 'close') {
      const valueTag = target.closest('span')
      let optId = valueTag ? valueTag.getAttribute('id') : null
      if (optId) {
        optId = optId.split('::')[1]
      }
      const option = this.getExtOptions().find(opt => opt.id === optId)
      this.raiseChange(option || null)
    } else {
      handleEvent(this.props.onFocus, this.props.name)
      this.openList()
    }
  }

  handleListBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    this.setState({ isOpen: false })
    const isNotControlledBlur =
      !event.relatedTarget || event.relatedTarget !== this.triggerRef.current
    if (isNotControlledBlur && typeof this.props.onBlur === 'function') {
      this.props.onBlur(this.props.name)
    }
  }

  handleListClick = (event: React.MouseEvent<HTMLUListElement>) => {
    let target: Element | null = event.target as HTMLElement
    if (target.getAttribute('role') !== 'option') {
      target = target.closest('[role=option]')
      if (target === null) return
    }
    if (target.getAttribute('role') === 'option') {
      event.preventDefault()
      const activeId = target.id as string
      const active = this.getExtOptions().find(o => o.id === activeId)
      this.raiseChange(active || null)
      if (!this.props.multiple || !event.metaKey) {
        this.closeList()
      }
    }
  }

  /** END event handlers */
  /** START helpers */

  raiseChange = (option: OptionType | null, onlyAdd: boolean = false) => {
    if (option === null) {
      return
    }
    let value: SelectValueType = this.state.value
    const isMultiple = this.props.multiple
    if (isMultiple) {
      if (value === null) {
        value = []
      } else {
        value = ([] as Array<string | number>).concat(value)
      }
      if (value.includes(option.value)) {
        if (!onlyAdd) {
          value = value.filter(v => v !== option.value)
        }
      } else {
        value.push(option.value)
      }
    } else {
      value = option.value
    }
    this.resetMemo()
    this.setState({ value })
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.props.name, value)
    }
  }

  openList() {
    this.setState({ isOpen: true })
    window.requestAnimationFrame(() => {
      if (this.listRef.current !== null) {
        this.listRef.current.focus()
      }
    })
  }

  closeList = () => {
    this.setState({ isOpen: false })
    window.requestAnimationFrame(() => {
      if (this.triggerRef.current !== null) {
        this.triggerRef.current.focus()
      }
    })
  }

  isSelected = (option: OptionType) => {
    return (
      (Array.isArray(this.state.value) && this.state.value.includes(option.value)) ||
      this.state.value === option.value
    )
  }

  isList(node: any) {
    return this.listRef.current!.isList(node)
  }

  getOptByValue(value: string | number) {
    for (const o of this.props.options) {
      const option = asOption(o)
      if (String(option.value) === String(value)) {
        return option
      }
    }
    return null
  }

  /** used to reduce rerenders of List and ValueSpan */
  memoizedExtOptions: {
    id: string | undefined
    options: Array<string | number | OptionType>
    memo: ExtendedOptionType[]
    value: SelectValueType
  } = {
    id: undefined,
    options: [],
    memo: [],
    value: null,
  }

  getExtOptions() {
    const selectId = this.props.id
    if (
      this.memoizedExtOptions.memo.length !== 0 &&
      this.memoizedExtOptions.id === selectId &&
      this.props.options === this.memoizedExtOptions.options &&
      this.props.value === this.memoizedExtOptions.value
    ) {
      return this.memoizedExtOptions.memo
    }
    this.memoizedExtOptions = {
      id: selectId,
      options: this.props.options,
      value: this.state.value,
      memo: this.props.options.map(o => {
        let opt = asOption(o)
        return {
          ...opt,
          id: getOptionId(selectId, opt),
          isSelected: this.isSelected(opt),
        } as ExtendedOptionType
      }),
    }
    return this.memoizedExtOptions.memo
  }

  resetMemo = () => {
    this.memoizedExtOptions.memo = []
  }

  /** END helpers */

  render() {
    let {
      name,
      id,
      disabled,
      options: mixOptions,
      className,
      placeholder,
      width,
      status,
      onChange,
      onBlur,
      onFocus,
      multiple,
      extraLabel,
      value: propsValue,
      ...rest
    } = omitMargins(this.props) as Omit<SelectProps, keyof MarginProps>
    let { isOpen } = this.state
    let options = this.getExtOptions()

    return (
      <div className={className}>
        <Rect observe={isOpen}>
          {({ ref: triggerRef, rect: triggerRect }) => (
            <>
              <SelectTrigger
                {...rest}
                id={id}
                name={name}
                onKeyUp={this.handleKeyUp}
                onClick={this.handleClick}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                disabled={disabled}
                ref={node => {
                  triggerRef(node)
                  // @ts-ignore
                  this.triggerRef.current = node
                }}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen || undefined}
                aria-multiselectable={multiple}
              >
                <ValueSwitch
                  extraLabel={extraLabel || '+{} more'}
                  options={options}
                  placeholder={placeholder}
                  multiple={multiple}
                />
                <NavigationChevronDown iconSize="tiny" />
              </SelectTrigger>
              <List
                ref={this.listRef}
                isOpen={isOpen}
                options={options}
                multiple={multiple}
                onBlur={this.handleListBlur}
                onClick={this.handleListClick}
                raiseChange={this.raiseChange}
                onClose={this.closeList}
                triggerRect={triggerRect}
              />
            </>
          )}
        </Rect>
      </div>
    )
  }
}

export const Select = styled(SelectBase)`
  max-width: 100%;
  ${margin}
  ${width}

  ${SelectTrigger} {
    ${displayStatus}
  }
`

// @ts-ignore
Select.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ),
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.number.isRequired),
  ]).isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  extraLabel: PropTypes.string,
  status: StatusPropType,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

Select.defaultProps = {
  placeholder: 'Select an option',
  multiple: false,
  extraLabel: '+{} more',
}

export default Select
