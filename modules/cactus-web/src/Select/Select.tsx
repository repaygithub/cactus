import React from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { FieldOnBlurHandler, FieldOnChangeHandler, FieldOnFocusHandler, Omit } from '../types'
import { getScrollX, getScrollY } from '../helpers/scrollOffset'
import { MarginProps, margins, splitProps } from '../helpers/margins'
import { NavigationChevronDown } from '@repay/cactus-icons'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'
import { width, WidthProps } from 'styled-system'
import handleEvent from '../helpers/eventHandler'
import KeyCodes from '../helpers/keyCodes'
import Portal from '@reach/portal'
import PropTypes from 'prop-types'
import Rect from '@reach/rect'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

export type OptionType = { label: string; value: string | number }

export interface SelectProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref' | 'onChange' | 'onBlur' | 'onFocus'
    > {
  options: OptionType[] | string[]
  id: string
  name: string
  value?: string | number
  placeholder?: string
  className?: string
  /** !important */
  disabled?: boolean
  status?: Status
  onChange?: FieldOnChangeHandler<string | number>
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

const ValueSpan = styled.span`
  font-size: ${p => p.theme.fontSizes.p}px;
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
  border-width: 2px;
  border-style: solid;
  border-color: ${p => p.theme.colors.darkestContrast};
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

const List = styled.ul`
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

  &.selected-option {
    background-color: ${p => p.theme.colors.callToAction};
    color: ${p => p.theme.colors.callToActionText};
  }
`

function asOption(opt: string | OptionType): OptionType {
  if (typeof opt === 'string') {
    return { label: opt, value: opt }
  }
  return opt
}

function getOptionId(selectId: string, option: OptionType) {
  return `${selectId}-${option.label}-${option.value}`.replace(/\s/g, '-')
}

function getOptionsMap(selectId: string, options: OptionType[]) {
  let optionsMap: { [k: string]: OptionType & { id: string } } = {}
  for (let i = 0; i < options.length; ++i) {
    const opt = asOption(options[i])
    optionsMap[opt.value] = {
      ...opt,
      id: getOptionId(selectId, opt),
    }
  }
  return optionsMap
}

function getSelectedIndex(options: string[] | OptionType[], value: string | number): number {
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
  value: string | number | null
  selectedValue: string | number | null
}

class SelectBase extends React.Component<SelectProps, SelectState> {
  constructor(props: SelectProps) {
    super(props)
    this.state = {
      isOpen: false,
      value: this.props.value || null,
      selectedValue: null,
    }
    this.pendingChars = ''
    this.searchIndex = -1
    this.didScroll = false
    this.listRef = React.createRef<HTMLUListElement>()
    this.triggerRef = React.createRef<HTMLButtonElement>()
    // @ts-ignore
    this.optionsMap = getOptionsMap(props.id, props.options.map(asOption))
  }

  pendingChars: string
  searchIndex: number
  didScroll: boolean
  keyClear: number | undefined
  scrollClear: number | undefined
  listRef: React.RefObject<HTMLUListElement>
  triggerRef: React.RefObject<HTMLButtonElement>
  optionsMap: { [k: string]: OptionType & { id: string } }

  static getDerivedStateFromProps(props: Readonly<SelectProps>, state: Readonly<SelectState>) {
    if (props.value !== undefined && props.value !== state.value) {
      return { value: props.value, selectedValue: null } as Partial<SelectState>
    }
    return null
  }

  componentDidUpdate(_: any, prevState: SelectState) {
    if (this.state.isOpen && (this.state.value || this.state.selectedValue)) {
      window.requestAnimationFrame(() => {
        let listEl = this.listRef.current
        let selected = this.state.selectedValue || this.state.value

        if (listEl === null || selected === null) {
          return
        }
        let selectedOption: OptionType = asOption(
          this.props.options[getSelectedIndex(this.props.options, selected)]
        )
        let optionEl: HTMLElement | null = document.getElementById(
          `#${getOptionId(this.props.id, selectedOption)}`
        )
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
    clearTimeout(this.keyClear)
    clearTimeout(this.scrollClear)
  }

  /** END life-cycle methods */
  /** START event handlers */

  handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    const isNotControlledBlur = !event.relatedTarget || event.relatedTarget !== this.listRef.current
    if (isNotControlledBlur) {
      handleEvent(this.props.onBlur, this.props.name)
    }
  }

  handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    const isNotControlledFocus =
      !event.relatedTarget || event.relatedTarget !== this.listRef.current
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
        // this.handleListKeyDown(event)
        break
      }
    }
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.openList()
  }

  handleListFocus = (event: React.FocusEvent<HTMLUListElement>) => {
    if (this.state.value) {
      return
    }

    // set first option as selected
    const value = this.props.options[0] ? asOption(this.props.options[0]).value : null
    this.setState({ selectedValue: value })
  }

  handleListBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    this.setState({ isOpen: false })
    const isNotControlledBlur =
      !event.relatedTarget || event.relatedTarget !== this.triggerRef.current
    if (isNotControlledBlur && typeof this.props.onBlur === 'function') {
      this.setState({ selectedValue: null })
      this.props.onBlur(this.props.name)
    }
  }

  handleListKeyDown = (event: React.KeyboardEvent) => {
    const key = event.which || event.keyCode
    const selectedValue =
      this.state.selectedValue !== null ? this.state.selectedValue : this.state.value
    if (selectedValue === null) {
      return
    }
    let nextIndex = getSelectedIndex(this.props.options, selectedValue)

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
          this.setState({ selectedValue: asOption(this.props.options[0]).value })
        } else if (nextIndex >= this.props.options.length - 1) {
          this.setState({
            selectedValue: asOption(this.props.options[this.props.options.length - 1]).value,
          })
        } else {
          this.setState({ selectedValue: asOption(this.props.options[nextIndex]).value })
        }

        break
      }
      case KeyCodes.HOME: {
        event.preventDefault()
        this.setState({ selectedValue: asOption(this.props.options[0]).value })
        break
      }
      case KeyCodes.END:
        event.preventDefault()
        this.setState({
          selectedValue: asOption(this.props.options[this.props.options.length - 1]).value,
        })
        break
      case KeyCodes.SPACE:
        event.preventDefault()
        // for multi-select
        // this.toggleSelectItem(nextItem)
        break
      case KeyCodes.RETURN: {
        event.preventDefault()
        if (this.state.selectedValue !== null) {
          this.raiseChange(this.state.selectedValue)
        }
        this.closeList()
        break
      }
      case KeyCodes.ESC: {
        event.preventDefault()
        this.setState({ selectedValue: null })
        this.closeList()
        break
      }
      default:
        // type to search
        const option = this.findOptionToFocus(key)
        if (option !== null) {
          this.setState({ selectedValue: option.value })
        }
        break
    }
  }

  handleListClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target as HTMLElement
    if (target.getAttribute('role') === 'option') {
      const selectedOption = this.optionsMap[target.getAttribute('data-value') as string]
      this.raiseChange(selectedOption.value)
      this.closeList()
    }
  }

  handleOptionMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
    const currentTarget = event.currentTarget
    // prevent triggering by automated scrolling
    if (!this.didScroll) {
      const selectedOption = this.optionsMap[currentTarget.getAttribute('data-value') as string]
      this.setState({ selectedValue: selectedOption.value })
    }
  }

  /** END event handlers */
  /** START helpers */

  raiseChange(value: string | number) {
    this.setState({
      value,
      selectedValue: null,
    })
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

  closeList() {
    this.setState({ isOpen: false })
    window.requestAnimationFrame(() => {
      if (this.triggerRef.current !== null) {
        this.triggerRef.current.focus()
      }
    })
  }

  findOptionToFocus(key: number) {
    const character = String.fromCharCode(key)
    let selected = this.state.selectedValue || this.state.value
    if (!this.pendingChars && selected) {
      this.searchIndex = getSelectedIndex(this.props.options, selected)
    }
    this.pendingChars += character
    let nextMatch = this.findMatchInRange(this.searchIndex + 1, this.props.options.length)
    if (nextMatch === null) {
      nextMatch = this.findMatchInRange(0, this.searchIndex)
    }
    this.clearPendingKeysAfterDelay()
    return nextMatch
  }

  findMatchInRange(startIndex: number, endIndex: number) {
    for (let i = startIndex; i < endIndex; ++i) {
      const opt = asOption(this.props.options[i])
      if (opt.label.toLowerCase().startsWith(this.pendingChars.toLowerCase())) {
        return opt
      }
    }
    return null
  }

  clearPendingKeysAfterDelay() {
    if (this.keyClear) {
      clearTimeout(this.keyClear)
      this.keyClear = undefined
    }
    this.keyClear = setTimeout(() => {
      this.pendingChars = ''
      this.keyClear = undefined
    }, 500)
  }

  scrolled() {
    this.didScroll = true
    clearTimeout(this.scrollClear)
    this.scrollClear = setTimeout(() => {
      this.didScroll = false
    }, 150) // 120ms worked on Firefox and IE11 so 150 is just extra safe
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
      ...rest
    } = splitProps(this.props)
    let { isOpen, value, selectedValue } = this.state
    // @ts-ignore
    let options: OptionType[] = mixOptions.map(asOption)

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
              >
                {value && this.optionsMap.hasOwnProperty(value) ? (
                  <ValueSpan>{this.optionsMap[value].label}</ValueSpan>
                ) : (
                  <Placeholder>{placeholder}</Placeholder>
                )}
                <NavigationChevronDown iconSize="tiny" />
              </SelectTrigger>
              <Portal>
                <Rect observe={isOpen}>
                  {({ ref: listRef, rect: listRect }) => {
                    const selected = selectedValue !== null ? selectedValue : value
                    let activeDescendant: string | undefined = undefined
                    if (selected !== null && isOpen) {
                      activeDescendant = this.optionsMap.hasOwnProperty(selected)
                        ? this.optionsMap[selected].id
                        : this.optionsMap[Object.keys(this.optionsMap)[0]].id
                    }
                    return (
                      <List
                        onBlur={this.handleListBlur}
                        onFocus={this.handleListFocus}
                        onClick={this.handleListClick}
                        onKeyDown={this.handleListKeyDown}
                        role="listbox"
                        tabIndex={-1}
                        ref={n => {
                          listRef(n)
                          // @ts-ignore
                          this.listRef.current = n
                        }}
                        style={positionList(isOpen, triggerRect, listRect)}
                        aria-activedescendant={activeDescendant}
                      >
                        {options.map(o => {
                          const opt = this.optionsMap[o.value]
                          const isSelected = activeDescendant === opt.id || undefined
                          return (
                            <Option
                              id={opt.id}
                              key={opt.id}
                              className={isSelected && 'selected-option'}
                              data-value={opt.value}
                              role="option"
                              aria-selected={isSelected}
                              onMouseEnter={this.handleOptionMouseEnter}
                            >
                              {opt.label}
                            </Option>
                          )
                        })}
                      </List>
                    )
                  }}
                </Rect>
              </Portal>
            </>
          )}
        </Rect>
      </div>
    )
  }
}

export const Select = styled(SelectBase)`
  ${margins}
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
  ]).isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  status: StatusPropType,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
}

Select.defaultProps = {
  placeholder: 'Select an option',
}

export default Select
