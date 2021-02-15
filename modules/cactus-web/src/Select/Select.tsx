import '../helpers/polyfills'

import { ActionsAdd, NavigationChevronDown } from '@repay/cactus-icons'
import { BorderSize, CactusTheme, ColorStyle, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { useLayoutEffect, useRef, useState } from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { margin, MarginProps } from 'styled-system'
import { width as styledSystemWidth, WidthProps } from 'styled-system'

import CheckBox from '../CheckBox/CheckBox'
import Flex from '../Flex/Flex'
import { isIE, isResponsiveTouchDevice } from '../helpers/constants'
import {
  CactusChangeEvent,
  CactusEventTarget,
  CactusFocusEvent,
  isFocusOut,
} from '../helpers/events'
import KeyCodes from '../helpers/keyCodes'
import { omitMargins } from '../helpers/omit'
import { positionDropDown, usePositioning } from '../helpers/positionPopover'
import { isPurelyEqual } from '../helpers/react'
import { textFieldStatusMap } from '../helpers/status'
import { boxShadow, fontSize, radius, textStyle } from '../helpers/theme'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'
import Tag from '../Tag/Tag'
import TextButton from '../TextButton/TextButton'

export type SelectValueType = string | number | (string | number)[] | null

interface WithValue {
  value: string | number
}

export interface OptionType extends WithValue {
  label: string
}

interface OptionProps extends WithValue {
  children?: React.ReactNode
  id?: string
  'aria-label'?: string
  altText?: string
}

interface ExtendedOptionType extends WithValue {
  label: React.ReactNode
  isSelected: boolean
  id: string
  ariaLabel?: string
  altText?: string
}

type OptMap = Map<string | number, ExtendedOptionType>

interface InternalOptionProps extends React.LiHTMLAttributes<HTMLLIElement> {
  option: ExtendedOptionType
}

type Target = CactusEventTarget<SelectValueType>

export interface SelectProps
  extends MarginProps,
    WidthProps,
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref' | 'onChange' | 'onBlur' | 'onFocus'
    > {
  options?: (OptionType | string | number)[]
  id: string
  name: string
  value?: string | number | (string | number)[] | null
  placeholder?: string
  className?: string
  /** !important */
  disabled?: boolean
  multiple?: boolean
  comboBox?: boolean
  canCreateOption?: boolean
  matchNotFoundText?: string
  comboBoxSearchLabel?: string
  onDropdownToggle?: (prop: boolean) => void
  noOptionsText?: string
  /**
   * Used when there are multiple selected, but too many to show. place '{}' to insert unshown number in label
   */
  extraLabel?: string
  status?: Status
  onChange?: React.ChangeEventHandler<Target>
  onBlur?: React.FocusEventHandler<Target>
  onFocus?: React.FocusEventHandler<Target>
}

const displayStatus: any = (props: SelectProps): ReturnType<typeof css> | string => {
  if (props.status && !props.disabled) {
    return textFieldStatusMap[props.status as Status]
  } else {
    return ''
  }
}

function isElement(el?: any): el is HTMLElement {
  return el && el.nodeType === 1
}

function doesChildOverflow(parentRect: ClientRect, childRect: ClientRect): boolean {
  return childRect.left + childRect.width > parentRect.left + parentRect.width
}

function willTruncateBlockShow(
  parentRect: ClientRect,
  childRect: ClientRect,
  truncateRect: ClientRect
): boolean {
  return parentRect.left + parentRect.width >= childRect.left + truncateRect.width
}

const ValueSwitch = (props: {
  options: ExtendedOptionType[]
  placeholder: string | undefined
  extraLabel: string
  multiple?: boolean
}): React.ReactElement => {
  const selected = props.options.filter((o): boolean => o.isSelected)
  const numSelected = selected.length
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const moreRef = useRef<HTMLSpanElement | null>(null)
  const [numToRender, setNum] = useState(numSelected)
  const [prevValue, setPrevValue] = useState<string>('')
  const valueString = selected.reduce((m, o): string => m + getLabel(o), '')
  const shouldRenderAll = prevValue !== valueString
  /**
   * finds the maximum number of values it can display
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect((): void => {
    if (spanRef.current !== null && moreRef.current !== null && shouldRenderAll) {
      setPrevValue(valueString)
      const parentRect = spanRef.current.getBoundingClientRect()
      const numberChildren = spanRef.current.childNodes.length
      let index =
        numToRender < numberChildren && isElement(spanRef.current.childNodes[numToRender])
          ? numToRender
          : 0
      let child: any = spanRef.current.childNodes[index] as HTMLElement
      let childRect = child.getBoundingClientRect()
      const direction = doesChildOverflow(parentRect, childRect) ? -1 : 1
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
          {selected.slice(0, shouldRenderAll ? undefined : numToRender).map(
            (opt): React.ReactElement => (
              <Tag id={`value-tag::${opt.id}`} closeOption key={opt.id}>
                {opt.altText || opt.value}
              </Tag>
            )
          )}
          <Tag ref={moreRef} hidden={numToRender >= numSelected || shouldRenderAll}>
            {props.extraLabel.replace(/\{\}/, String(numSelected - numToRender))}
          </Tag>
        </ValueSpan>
      )
    } else {
      const value = selected[0]
      return (
        <ValueSpan>
          <Tag id={`value-tag::${value.id}`} closeOption>
            {value.altText || value.value}
          </Tag>
        </ValueSpan>
      )
    }
  } else {
    return <ValueSpan>{selected[0].altText || selected[0].value}</ValueSpan>
  }
}

const ValueSpan = styled.span`
  display: inline-block;
  ${(p): string => fontSize(p.theme, 'p')};
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Placeholder = styled.span`
  font-style: italic;
  color: ${(p): string => p.theme.colors.darkContrast};
  ${(p): string => fontSize(p.theme, 'p')};
`

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border-width: 1px;
  `,
  thick: css`
    border-width: 2px;
  `,
}

const getBorder = (borderSize: BorderSize): ReturnType<typeof css> => borderMap[borderSize]

const SelectTrigger = styled.button`
  position: relative;
  box-sizing: border-box;
  min-width: 194px;
  width: 100%;
  height: 32px;
  padding: 0 28px 0 16px;
  background-color: transparent;
  border-radius: ${radius(20)};
  ${(p): ReturnType<typeof css> => getBorder(p.theme.border)}
  border-style: solid;
  border-color: ${(p): string => p.theme.colors.darkContrast};
  text-align: left;
  outline: none;
  appearance: none;
  cursor: pointer;
  :disabled {
    border-color: ${(p): string => p.theme.colors.mediumGray};
    color: ${(p): string => p.theme.colors.mediumGray};
    cursor: not-allowed;
    ${Placeholder} {
      color: ${(p): string => p.theme.colors.mediumGray};
    }
  }
  &::-moz-focus-inner {
    border: 0;
  }
  &:focus,
  &[aria-expanded] {
    border-color: ${(p): string => p.theme.colors.callToAction};
    ${NavigationChevronDown} {
      color: ${(p): string => p.theme.colors.callToAction};
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

const ComboInput = styled.input`
  position: relative;
  box-sizing: border-box;
  min-width: 194px;
  width: 100%;
  height: 32px;
  padding: 0 24px 0 16px;
  background-color: transparent;
  border-radius: ${radius(20)};
  ${(p): ReturnType<typeof css> => getBorder(p.theme.border)}
  border-style: solid;
  border-color: ${(p): string => p.theme.colors.darkContrast};
  text-align: left;
  outline: none;
  appearance: none;
  font-size: 18px;
  &::-moz-focus-inner {
    border: 0;
  }
  &:focus,
  &[aria-expanded] {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }
`

const DONE_SECTION_HEIGHT = 52
let RESPONSIVE_HEIGHT = 0

function responsiveHeight(): number {
  return (typeof window !== 'undefined' && window.innerHeight * 0.4) || 0
}

const getListBoxShadowStyles = (theme: CactusTheme): ReturnType<typeof css> => {
  return theme.boxShadows
    ? css`
        border: 0px;
      `
    : css`
        ${borderMap[theme.border]}
        border-color: ${theme.colors.lightContrast};
      `
}

const StyledList = styled.ul`
  position: relative;
  box-sizing: border-box;
  z-index: 100;
  max-height: inherit;
  max-width: 100vw;
  padding: 8px 0;
  margin-top: 0;
  margin-bottom: 0;
  overflow-y: auto;
  outline: none;
  border-radius: ${radius(8)};
  ${(p): ReturnType<typeof css> => getListBoxShadowStyles(p.theme)}
  border-style: solid;
  ${(): string =>
    isResponsiveTouchDevice
      ? `
    margin-bottom: ${DONE_SECTION_HEIGHT}px;
    height: calc(100% - ${DONE_SECTION_HEIGHT}px);
    padding: 20px 0;`
      : ''}
`

const NoMatch = styled.li`
  display: list-item;
  border: none;
  height: auto;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
  text-align: left;
  box-shadow: none;
  padding: 4px 16px;
  overflow-wrap: break-word;
`

const StyledOption = styled.li`
  cursor: pointer;
  display: list-item;
  border: none;
  height: auto;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')};
  text-align: left;
  box-shadow: none;
  padding: 4px 16px;
  overflow-wrap: break-word;
  ${(p): string =>
    isResponsiveTouchDevice
      ? `
    padding: 6px 16px;
    & + & {
      border-top: 1px solid ${p.theme.colors.lightGray};
    }`
      : ''}
  &.highlighted-option {
    ${(p): ColorStyle => p.theme.colorStyles.callToAction};
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

export const SelectOption: React.FC<OptionProps> = ({ children }) => <>{children}</>

const InternalOption: React.FC<InternalOptionProps> = ({ option, ...props }) => {
  const ref = React.useRef<HTMLLIElement>(null)
  React.useEffect(() => {
    if (option.altText === undefined && ref.current) {
      option.altText = ref.current.textContent || ''
    }
  }, [option])
  return (
    <StyledOption
      ref={ref}
      role="option"
      data-value={option.value}
      id={option.id}
      aria-label={option.ariaLabel}
      {...props}
    />
  )
}

const getLabel = ({ label, altText, value }: ExtendedOptionType): string =>
  typeof label === 'string' ? label : altText || value.toString()

interface ListWrapperProps {
  isOpen: boolean
  anchorRef: React.RefObject<HTMLDivElement>
  children: React.ReactNode
}

const ListWrapper: React.FC<ListWrapperProps> = ({ isOpen, children, anchorRef }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const position = isResponsiveTouchDevice ? positionResponsive : positionDropDown
  usePositioning({
    position,
    ref,
    anchorRef,
    visible: isOpen,
    updateOnScroll: !isResponsiveTouchDevice,
  })
  return (
    <StyledListWrapper role="dialog" aria-hidden={isOpen ? undefined : true} ref={ref}>
      {children}
    </StyledListWrapper>
  )
}

const StyledListWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  box-sizing: border-box;
  display: block;
  &[aria-hidden='true'] {
    display: none;
  }
  border-radius: ${radius(8)};
  max-height: 400px;
  max-width: 100vw;
  ${(p): string => boxShadow(p.theme, 1)};
  background-color: ${(p): string => p.theme.colors.white};
  ${(): string =>
    isResponsiveTouchDevice
      ? `
    left: 0;
    bottom: 0;
    border-radius: 0;
    box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.5);
    &:after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: calc(100% - ${DONE_SECTION_HEIGHT}px);
      width: 100%;
      content: '';
      pointer-events: none;
      z-index: 100;
      background: linear-gradient(
        rgba(255, 255, 255),
        rgba(255, 255, 255, 0) 20% 80%,
        rgba(255, 255, 255)
      );
    }`
      : ''}
  ${Flex} {
    bottom: 0;
    position: fixed;
    height: ${DONE_SECTION_HEIGHT}px;
    border-top: 1px solid ${(p): string => p.theme.colors.lightGray};
    width: 100%;
    padding: 8px 0;
  }
`

interface ListProps {
  isOpen: boolean
  comboBox?: boolean
  canCreateOption: boolean
  matchNotFoundText: string
  comboBoxSearchLabel: string
  options: ExtendedOptionType[]
  multiple?: boolean
  searchValue: string
  onBlur: (event: React.FocusEvent<HTMLUListElement>) => void
  onClick: (event: React.MouseEvent<HTMLUListElement>) => void
  raiseChange: (event: React.SyntheticEvent, active: WithValue | null, noToggle?: boolean) => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLDivElement>
  activeDescendant: string
  setActiveDescendant?: (activeDescendant: string) => void
  handleComboInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleComboInputBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

function getSelectedIndex(options: WithValue[], value: string | number): number {
  for (let i = 0; i < options.length; ++i) {
    if (options[i].value === value) {
      return i
    }
  }

  return 0
}

function getIsSelected(selectedValues: SelectValueType, value: string | number) {
  return (
    (Array.isArray(selectedValues) && selectedValues.includes(value)) || selectedValues === value
  )
}

function findMatchInRange(
  options: ExtendedOptionType[],
  pendingChars: string,
  startIndex: number,
  endIndex: number
): ExtendedOptionType | null {
  for (let i = startIndex; i < endIndex; ++i) {
    const opt = options[i]
    if (getLabel(opt).toLowerCase().startsWith(pendingChars.toLowerCase())) {
      return opt
    }
  }
  return null
}

function positionResponsive(dd: HTMLElement) {
  dd.style.height = `${RESPONSIVE_HEIGHT}px`
  dd.style.width = `${window.innerWidth}px`
}

interface ListState {
  activeDescendant: string
  searchValue: string
  options: ExtendedOptionType[]
}

class List extends React.Component<ListProps, ListState> {
  public state = {
    activeDescendant: '',
    searchValue: this.props.searchValue,
    options: this.props.options,
  }
  private listRef: HTMLUListElement | null = null
  private mobileInputRef = React.createRef<HTMLInputElement>()

  private pendingChars = ''
  private keyClear: number | undefined
  private searchIndex = 0
  private scrollClear: number | undefined
  private didScroll = false

  /** Start List event handlers */

  private handleBlur = (event: React.FocusEvent<HTMLUListElement>): void => {
    this.setActiveDescendant('')
    this.props.onBlur(event)
  }

  private handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>): void => {
    const key = event.which || event.keyCode
    const active = this.getActiveOpt()
    const options = this.state.options
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
          this.setActiveDescendant(options[0].id)
        } else if (nextIndex >= options.length - 1) {
          this.setActiveDescendant(options[options.length - 1].id)
        } else {
          this.setActiveDescendant(options[nextIndex].id)
        }

        break
      }
      case KeyCodes.HOME: {
        event.preventDefault()
        this.setActiveDescendant(options[0].id)
        break
      }
      case KeyCodes.END:
        event.preventDefault()
        this.setActiveDescendant(options[options.length - 1].id)
        break
      case KeyCodes.SPACE:
        event.preventDefault()
        if (this.props.multiple) {
          this.props.raiseChange(event, active)
        }
        break
      case KeyCodes.RETURN: {
        event.preventDefault()
        this.setActiveDescendant('')
        this.props.raiseChange(event, active, true)
        this.props.onClose()
        break
      }
      case KeyCodes.ESC: {
        event.preventDefault()
        this.setActiveDescendant('')
        this.props.onClose()
        break
      }
      default:
        // type to search
        const option = this.findOptionToFocus(key)
        if (option !== null) {
          this.setActiveDescendant(option.id)
        }
        break
    }
  }

  private handleOptionMouseEnter = (event: React.MouseEvent<HTMLLIElement>): void => {
    const currentTarget = event.currentTarget
    // prevent triggering by automated scrolling
    if (!this.didScroll) {
      this.setActiveDescendant(currentTarget.id)
    }
  }

  /** End List event handlers */
  /** Start List helpers */

  public focus = (): void => {
    this.listRef !== null && this.listRef.focus()
  }

  public isList = (node: HTMLElement | null): boolean => this.listRef === node

  public getActiveOpt(): ExtendedOptionType | null {
    const activeDescendant = this.props.comboBox
      ? this.props.activeDescendant
      : this.state.activeDescendant
    if (activeDescendant === '') {
      return null
    }
    return this.state.options.find((o): boolean => o.id === activeDescendant) || null
  }

  private findOptionToFocus(key: number): ExtendedOptionType | null {
    const character = String.fromCharCode(key)
    const options = this.state.options
    const selected = this.getActiveOpt()
    if (!this.pendingChars && selected !== null) {
      this.searchIndex = getSelectedIndex(this.state.options, selected.value)
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
    this.keyClear = window.setTimeout((): void => {
      this.pendingChars = ''
      this.keyClear = undefined
    }, 500)
    return nextMatch
  }

  private scrolled = (): void => {
    this.didScroll = true
    clearTimeout(this.scrollClear)
    this.scrollClear = window.setTimeout((): void => {
      this.didScroll = false
    }, 150) // 120ms worked on Firefox and IE11 so 150 is just extra safe
  }

  public static initActiveDescendant(options: ExtendedOptionType[]): string {
    let activeId = ''
    const selected = options.find((o): boolean => o.isSelected)
    if (selected) {
      activeId = selected.id
    } else if (options.length) {
      activeId = options[0].id
    }
    return activeId
  }

  private static filterOptions = (
    options: ExtendedOptionType[],
    searchValue: string
  ): [ExtendedOptionType[], boolean] => {
    let addOption = searchValue !== ''
    searchValue = searchValue.toLowerCase()
    options = options.filter((opt: ExtendedOptionType): boolean => {
      const label = getLabel(opt).toLowerCase()
      const includesSearch = label.includes(searchValue)
      if (includesSearch && label.length === searchValue.length) {
        addOption = false
      }
      return includesSearch
    })
    return [options, addOption]
  }

  private setActiveDescendant = (id: string): void => {
    this.props.comboBox && typeof this.props.setActiveDescendant === 'function'
      ? this.props.setActiveDescendant(id)
      : this.setState({ activeDescendant: id })
  }

  /** End List helpers */

  private static getDerivedStateFromProps(props: ListProps, state: ListState): ListState | null {
    let filteredOptions: ExtendedOptionType[] = props.options
    let activeDescendant: string = state.activeDescendant
    let update = false

    if (
      props.isOpen &&
      props.comboBox &&
      (props.searchValue !== state.searchValue || props.options !== state.options)
    ) {
      const [filteredOpts, addOption] = List.filterOptions(props.options, props.searchValue)
      filteredOptions = filteredOpts
      if (addOption && props.canCreateOption) {
        const addOpt: ExtendedOptionType = {
          value: 'create',
          label: `Create "${props.searchValue}"`,
          id: `create-${props.searchValue}`,
          isSelected: false,
          altText: props.searchValue,
        }
        filteredOptions.unshift(addOpt)
      }
      update = true
    } else if (!props.comboBox && props.options !== state.options) {
      update = true
    }

    if (props.isOpen && !props.comboBox && state.activeDescendant === '') {
      activeDescendant = List.initActiveDescendant(filteredOptions)
      update = true
    }

    if (!props.isOpen && state.activeDescendant !== '') {
      activeDescendant = ''
      update = true
    }

    return update
      ? {
          activeDescendant: activeDescendant,
          options: filteredOptions,
          searchValue: props.searchValue,
        }
      : null
  }

  public componentDidMount(): void {
    RESPONSIVE_HEIGHT = isResponsiveTouchDevice ? responsiveHeight() : 0
  }

  public componentDidUpdate(prevProps: ListProps): void {
    if (this.props.isOpen) {
      const listJustOpened = !prevProps.isOpen

      if (listJustOpened) {
        if (
          this.mobileInputRef.current !== null &&
          document.activeElement !== this.mobileInputRef.current
        ) {
          this.mobileInputRef.current.focus()
        }
      }

      window.requestAnimationFrame((): void => {
        const listEl = this.listRef
        const activeDescendant = this.props.comboBox
          ? this.props.activeDescendant
          : this.state.activeDescendant

        if (listEl === null || activeDescendant === '') {
          return
        }
        const optionEl: HTMLElement | null = document.getElementById(activeDescendant)
        if (optionEl === null) {
          return
        }
        if (listEl.scrollHeight > listEl.clientHeight) {
          const scrollBottom = listEl.clientHeight + listEl.scrollTop
          const optionBottom = optionEl.offsetTop + optionEl.offsetHeight
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

  public componentWillUnmount(): void {
    clearTimeout(this.scrollClear)
    clearTimeout(this.keyClear)
  }

  public render(): React.ReactElement {
    const {
      isOpen,
      comboBox,
      multiple,
      anchorRef,
      onClose,
      activeDescendant: selectManagedActiveDescendant,
      matchNotFoundText,
    } = this.props
    const { options, activeDescendant: listManagedActiveDescendant } = this.state

    const activeDescendant = comboBox ? selectManagedActiveDescendant : listManagedActiveDescendant
    const setListRef = (n: HTMLUListElement | null): void => {
      this.listRef = n
    }

    return (
      <ListWrapper isOpen={isOpen} anchorRef={anchorRef}>
        <StyledList
          onBlur={this.handleBlur}
          onClick={this.props.onClick}
          onKeyDown={this.handleKeyDown}
          role="listbox"
          tabIndex={-1}
          ref={setListRef}
          aria-activedescendant={activeDescendant || undefined}
        >
          {options.length === 0 && !this.props.canCreateOption ? (
            <NoMatch>{matchNotFoundText}</NoMatch>
          ) : (
            options.map(
              (opt): React.ReactElement => {
                const optId = opt.id
                const isSelected = opt.isSelected
                let ariaSelected: boolean | 'true' | 'false' | undefined = isSelected || undefined
                const isCreateNewOption = comboBox && optId === `create-${this.state.searchValue}`
                // multiselectable should have aria-select©ed on all options
                if (multiple) {
                  ariaSelected = isSelected ? 'true' : 'false'
                }
                return (
                  <InternalOption
                    key={optId}
                    option={opt}
                    className={activeDescendant === optId ? 'highlighted-option' : undefined}
                    data-role={isCreateNewOption ? 'create' : 'option'}
                    aria-selected={ariaSelected}
                    onMouseEnter={this.handleOptionMouseEnter}
                  >
                    {isCreateNewOption ? (
                      <ActionsAdd mr={2} mb={2} />
                    ) : multiple ? (
                      <CheckBox
                        id={`multiselect-option-check-${optId}`}
                        aria-hidden="true"
                        checked={isSelected}
                        readOnly
                        mr={2}
                      />
                    ) : null}
                    {opt.label}
                  </InternalOption>
                )
              }
            )
          )}
        </StyledList>
        {isResponsiveTouchDevice ? (
          <Flex justifyContent={comboBox ? 'space-between' : 'center'}>
            {comboBox ? (
              <ComboInput
                data-role="mobile-search"
                type="text"
                role="textbox"
                ref={this.mobileInputRef}
                value={this.props.searchValue}
                onChange={this.props.handleComboInputChange}
                onBlur={this.props.handleComboInputBlur}
                style={{ width: '40%', marginLeft: '16px' }}
                aria-label={this.props.comboBoxSearchLabel}
              />
            ) : null}
            <TextButton onClick={onClose} variant="action" mr={comboBox ? 4 : 0}>
              Done
            </TextButton>
          </Flex>
        ) : null}
      </ListWrapper>
    )
  }
}

function asOption(opt: number | string | OptionType): OptionType {
  if (typeof opt === 'string') {
    const option: OptionType = { label: opt, value: opt }
    return option
  } else if (typeof opt === 'number') {
    const option: OptionType = { label: String(opt), value: opt }
    return option
  }
  return opt
}

function getOptionId(selectId: string, value: string | number): string {
  return `${selectId}-${value}`.replace(/\s/g, '-')
}

interface SelectState {
  isOpen: boolean
  value: string | number | (number | string)[] | null
  searchValue: string
  activeDescendant: string
  currentTriggerWidth: number
  extraOptions: OptionType[]
}

class SelectBase extends React.Component<SelectProps, SelectState> {
  public static Option = SelectOption

  public state = {
    isOpen: false,
    value: this.props.value || null,
    searchValue: '',
    activeDescendant: '',
    currentTriggerWidth: 0,
    extraOptions: [],
  }

  private pendingChars = ''
  private searchIndex = -1
  private keyClear: number | undefined
  private scrollClear: number | undefined
  private listRef = React.createRef<List>()
  private triggerRef = React.createRef<HTMLDivElement>()
  private comboInputRef = React.createRef<HTMLInputElement>()
  private isFocused = false
  private eventTarget = new CactusEventTarget<SelectValueType>({})

  public componentDidMount(): void {
    if (this.triggerRef.current !== null) {
      this.setState({ currentTriggerWidth: this.triggerRef.current.getBoundingClientRect().width })
    }
    this.resetMemo()
    this.detectOptionsFromValue()
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
  }

  public componentDidUpdate(prevProps: SelectProps): void {
    if (this.triggerRef.current !== null) {
      const triggerWidth = this.triggerRef.current.getBoundingClientRect().width
      if (triggerWidth !== this.state.currentTriggerWidth) {
        this.setState({
          currentTriggerWidth: triggerWidth,
        })
      }
    }
    this.resetMemo()
    if (JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
      this.detectOptionsFromValue()
    }
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
  }

  public static getDerivedStateFromProps(
    props: Readonly<SelectProps>,
    state: Readonly<SelectState>
  ): Partial<SelectState> | null {
    if (props.value !== undefined && props.value !== state.value) {
      const newState: Partial<SelectState> = { value: props.value }
      return newState
    }
    return null
  }

  public componentWillUnmount(): void {
    clearTimeout(this.keyClear)
    clearTimeout(this.scrollClear)
  }

  /** END life-cycle methods */
  /** START event handlers */

  private handleBlur = (event: React.FocusEvent<HTMLElement>): void => {
    const isListElem = this.listRef.current?.isList(event.relatedTarget as HTMLElement)
    if (isFocusOut(event) && !isListElem) {
      this.isFocused = false
      const cactusEvent = new CactusFocusEvent('blur', this.eventTarget, event)
      const { onBlur } = this.props
      onBlur?.(cactusEvent)
    }
  }

  private handleFocus = (event: React.FocusEvent): void => {
    if (!this.isFocused) {
      this.isFocused = true
      const cactusEvent = new CactusFocusEvent('focus', this.eventTarget, event)
      const { onFocus } = this.props
      onFocus?.(cactusEvent)
    }
  }

  private handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
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

  private handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
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
      const option = this.getExtOptions().find((opt): boolean => opt.id === optId)
      this.raiseChange(event, option || null)
    } else {
      this.openList()
    }
  }

  private handleListBlur = (event: React.FocusEvent<HTMLUListElement>): void => {
    const relatedTarget: Element | null = event.relatedTarget as HTMLElement
    if (
      relatedTarget instanceof HTMLElement &&
      (relatedTarget.getAttribute('id') === `${this.props.id}-input` ||
        relatedTarget.getAttribute('data-role') === 'mobile-search')
    ) {
      event.stopPropagation()
      return
    }
    this.setState({ isOpen: false })
    this.props.onDropdownToggle && this.props.onDropdownToggle(false)
  }

  private handleListClick = (event: React.MouseEvent<HTMLUListElement>): void => {
    let target: Element | null = event.target as HTMLElement
    if (target.getAttribute('role') !== 'option') {
      target = target.closest('[role=option]')
      if (target === null) return
    }
    if (target.getAttribute('data-role') === 'create') {
      event.preventDefault()
      this.createOption(event, this.state.searchValue)
      if (!this.props.multiple) {
        this.closeList()
        this.setState({ searchValue: '' })
      }
      return
    }
    if (target.getAttribute('role') === 'option') {
      event.preventDefault()
      const activeId = target.id
      const active = this.getExtOptions().find((o): boolean => o.id === activeId)

      this.raiseChange(event, active || null)
      if (!this.props.multiple) {
        this.closeList()
        this.setState({ searchValue: '' })
      }
    }
  }

  private handleComboInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value, activeDescendant: '' })
  }

  private handleComboInputBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    const relatedTarget: Element | null = event.relatedTarget as HTMLElement
    if (
      relatedTarget instanceof HTMLElement &&
      (relatedTarget.getAttribute('data-role') === 'create' ||
        relatedTarget.getAttribute('data-role') === 'mobile-search')
    ) {
      event.preventDefault()
      return
    }

    // In IE, there's no relatedTarget on blur with React versions lower than v17...it's already moved on to activeElement
    const isReact17 = event.nativeEvent.type === 'focusout'
    if (isIE && !isReact17) {
      setTimeout(() => {
        const focusTarget = document.activeElement
        this.closeListIfNotFocused(focusTarget)
      })
    } else {
      const focusTarget = relatedTarget
      this.closeListIfNotFocused(focusTarget)
    }
  }

  private handleComboInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const key = event.which || event.keyCode
    if (this.state.isOpen && this.listRef.current !== null) {
      const active = this.listRef.current.getActiveOpt()
      const options = this.listRef.current.state.options
      switch (key) {
        case KeyCodes.UP:
        case KeyCodes.DOWN: {
          event.preventDefault()

          if (active === null) {
            this.setState({
              activeDescendant: List.initActiveDescendant(options),
            })
            return
          }

          if (active === null) {
            return
          }
          let nextIndex = getSelectedIndex(options, active.value)
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
            this.setState({
              activeDescendant: options[nextIndex].id,
            })
          }
          break
        }
        case KeyCodes.RETURN: {
          event.preventDefault()
          if (this.state.activeDescendant === `create-${this.state.searchValue}`) {
            this.createOption(event, this.state.searchValue)
            this.setState({ activeDescendant: '' })
            break
          }
          const multiple = this.props.multiple
          if (!multiple || event.metaKey) {
            this.setState({ activeDescendant: '', searchValue: '' })
            this.closeList()
          }
          this.raiseChange(event, active, event.metaKey)
          break
        }
        case KeyCodes.ESC: {
          event.preventDefault()
          this.setState({ activeDescendant: '', searchValue: '' })
          this.closeList()
        }
      }
    }
  }

  private createOption = (event: React.SyntheticEvent, value: string | number): void => {
    const newOption = asOption(value)
    const extraOptions = (this.state.extraOptions as OptionType[]).concat(newOption)
    this.setState({ extraOptions })
    this.raiseChange(event, newOption, true)
    if (this.comboInputRef.current !== null) {
      this.comboInputRef.current.focus()
    }
    !this.props.multiple && this.closeList()
  }

  /** END event handlers */
  /** START helpers */

  private raiseChange = (
    event: React.SyntheticEvent,
    option: WithValue | null,
    onlyAdd = false
  ): void => {
    if (option === null) {
      return
    }
    let value: SelectValueType = this.state.value
    const isMultiple = this.props.multiple
    if (isMultiple) {
      if (value === null) {
        value = []
      } else {
        value = ([] as (string | number)[]).concat(value)
      }
      if (value.includes(option.value)) {
        if (!onlyAdd) {
          value = value.filter((v): boolean => v !== option.value)
        }
      } else {
        value.push(option.value)
      }
    } else {
      value = option.value
    }
    const extOpt = this.optionsMap.get(option.value)
    if (extOpt) {
      extOpt.isSelected = getIsSelected(value, option.value)
    } else {
      this.resetMemo()
    }
    this.setState({ value })
    this.eventTarget.value = value
    const { onChange } = this.props
    const cactusEvent = new CactusChangeEvent(this.eventTarget, event)
    onChange?.(cactusEvent)
  }

  private openList(): void {
    this.setState({ isOpen: true }, () => {
      this.props.onDropdownToggle && this.props.onDropdownToggle(true)
      if (!isResponsiveTouchDevice) {
        window.requestAnimationFrame((): void => {
          if (this.listRef.current !== null && !this.props.comboBox) {
            this.listRef.current.focus()
          } else if (this.comboInputRef.current !== null && this.props.comboBox) {
            this.comboInputRef.current.focus()
          }
        })
      }
    })
  }

  private closeList = (): void => {
    this.setState({ isOpen: false })
    this.props.onDropdownToggle && this.props.onDropdownToggle(false)
    window.requestAnimationFrame((): void => {
      if (this.triggerRef.current !== null) {
        if (this.triggerRef.current.children.length > 0) {
          const trigger = this.triggerRef.current.children[0] as HTMLButtonElement
          if (trigger.getAttribute('type') === 'button') {
            trigger.focus()
          }
        }
      }
    })
  }

  private closeListIfNotFocused = (focusTarget: Element | null) => {
    if (
      focusTarget === null ||
      (focusTarget instanceof HTMLElement && focusTarget.getAttribute('role') !== 'listbox')
    ) {
      this.closeList()
      this.setState({ searchValue: '', activeDescendant: '' })
    }
  }

  private detectOptionsFromValue(): void {
    if (this.props.comboBox && this.props.canCreateOption && this.props.value) {
      const newOptions: OptionType[] = []

      if (Array.isArray(this.props.value)) {
        this.props.value.forEach((val): void => {
          if (!this.optionsMap.has(val)) {
            newOptions.push(asOption(val))
          }
        })
      } else {
        if (!this.optionsMap.has(this.props.value)) {
          newOptions.push(asOption(this.props.value))
        }
      }
      if (newOptions.length > 0) {
        this.setState(
          (state): SelectState => ({
            ...state,
            extraOptions: state.extraOptions.concat(newOptions),
          })
        )
      }
    }
  }

  private extendedOptions: ExtendedOptionType[] | null = null
  private optionsMap: OptMap = new Map()

  private buildOptsFromChildren(children: React.ReactNode, prevOpts: OptMap) {
    const childArray = React.Children.toArray(children) as React.ReactChild[]
    if (!childArray?.length) return

    const selectId = this.props.id
    const optList = this.getExtOptions()
    for (const child of childArray) {
      if (typeof child === 'string' || typeof child === 'number') {
        optList.push(this.asExtOpt(child))
      } else if (child?.type === React.Fragment) {
        this.buildOptsFromChildren(child.props.children, prevOpts)
      } else if (child?.props) {
        const value = child.props.value
        if (typeof value === 'string' || typeof value === 'number') {
          const { altText: altProp, children, id, 'aria-label': ariaLabel } = child.props
          const rawLabel = children || children === 0 ? children : value
          const label = typeof rawLabel === 'number' ? rawLabel.toString() : rawLabel
          let altText: string | undefined = altProp || ariaLabel
          if (altText === undefined) {
            let prevOpt: ExtendedOptionType | undefined
            if (typeof label === 'string') {
              altText = label
            } else if ((prevOpt = prevOpts.get(value))) {
              // Try to minimize how often we have to pull from textContent;
              // this is to avoid the delay from `useEffect`, rather than performance reasons.
              if (prevOpt.altText !== undefined && isPurelyEqual(prevOpt.label, label)) {
                altText = prevOpt.altText
              }
            }
          }
          const opt: ExtendedOptionType = {
            value,
            label,
            altText,
            ariaLabel,
            id: id || getOptionId(selectId, value),
            isSelected: getIsSelected(this.state.value, value),
          }
          optList.push(opt)
          this.optionsMap.set(opt.value, opt)
        }
      }
    }
  }

  private asExtOpt(value: number | string | OptionType): ExtendedOptionType {
    let opt: ExtendedOptionType
    if (typeof value === 'number' || typeof value === 'string') {
      const label = value.toString()
      opt = {
        value,
        label,
        altText: label,
        id: getOptionId(this.props.id, value),
        isSelected: getIsSelected(this.state.value, value),
      }
    } else {
      opt = {
        ...value,
        altText: value.label,
        id: getOptionId(this.props.id, value.value),
        isSelected: getIsSelected(this.state.value, value.value),
      }
    }
    this.optionsMap.set(opt.value, opt)
    return opt
  }

  private getExtOptions(): ExtendedOptionType[] {
    if (this.extendedOptions !== null) {
      return this.extendedOptions
    }
    const prevOpts = this.optionsMap
    if (prevOpts.size > 0) {
      this.optionsMap = new Map()
    }
    const optList: ExtendedOptionType[] = (this.extendedOptions = [])
    if (this.props.children) {
      this.buildOptsFromChildren(this.props.children, prevOpts)
    } else if (this.props.options?.length) {
      for (const o of this.props.options) {
        optList.push(this.asExtOpt(o))
      }
    }
    for (const opt of this.state.extraOptions as OptionType[]) {
      if (!this.optionsMap.has(opt.value)) {
        optList.push(this.asExtOpt(opt))
      }
    }
    return optList
  }

  private resetMemo = (): void => {
    this.extendedOptions = null
  }

  private setActiveDescendant = (activeDescendant: string): void => {
    this.setState({ activeDescendant: activeDescendant })
  }

  /** END helpers */

  public render(): React.ReactElement {
    const {
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
      comboBox,
      canCreateOption = true,
      matchNotFoundText = 'No match found',
      extraLabel,
      value: propsValue,
      noOptionsText = 'No options available',
      onDropdownToggle,
      ...rest
    } = omitMargins(this.props) as Omit<SelectProps, keyof MarginProps>
    const { isOpen, searchValue, activeDescendant } = this.state
    const options = this.getExtOptions()
    const noOptsDisable =
      (!comboBox && options.length === 0) || (comboBox && !canCreateOption && options.length === 0)

    // Added `tabIndex=-1` on the wrapper element to compensate for
    // the fact that Safari cannot focus buttons on click.
    return (
      <div className={className}>
        <div
          ref={this.triggerRef}
          tabIndex={-1}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          {isOpen && comboBox ? (
            <ComboInput
              ref={this.comboInputRef}
              id={`${id}-input`}
              name={name}
              autoComplete="off"
              autoFocus={isResponsiveTouchDevice ? true : false}
              value={searchValue}
              style={{ width: `${this.state.currentTriggerWidth}px` }}
              onChange={this.handleComboInputChange}
              onBlur={this.handleComboInputBlur}
              onKeyDown={this.handleComboInputKeyDown}
              role="textbox"
              aria-haspopup="listbox"
              aria-expanded={isOpen || undefined}
              aria-multiselectable={multiple}
              aria-activedescendant={activeDescendant ? activeDescendant : undefined}
              aria-label={this.props.comboBoxSearchLabel || 'Search for an option'}
            />
          ) : (
            <SelectTrigger
              {...rest}
              id={id}
              name={name}
              onKeyUp={this.handleKeyUp}
              onClick={this.handleClick}
              disabled={noOptsDisable ? true : disabled}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isOpen || undefined}
              aria-multiselectable={multiple}
            >
              <ValueSwitch
                extraLabel={extraLabel || '+{} more'}
                options={options}
                placeholder={noOptsDisable ? noOptionsText : placeholder}
                multiple={multiple}
              />
              <NavigationChevronDown iconSize="tiny" />
            </SelectTrigger>
          )}
          <List
            ref={this.listRef}
            isOpen={isOpen}
            comboBox={comboBox}
            canCreateOption={canCreateOption}
            matchNotFoundText={matchNotFoundText}
            comboBoxSearchLabel={this.props.comboBoxSearchLabel || 'Search for an option'}
            options={options}
            multiple={multiple}
            searchValue={searchValue}
            activeDescendant={activeDescendant}
            setActiveDescendant={comboBox ? this.setActiveDescendant : undefined}
            handleComboInputChange={comboBox ? this.handleComboInputChange : undefined}
            handleComboInputBlur={comboBox ? this.handleComboInputBlur : undefined}
            onBlur={this.handleListBlur}
            onClick={this.handleListClick}
            raiseChange={this.raiseChange}
            onClose={this.closeList}
            anchorRef={this.triggerRef}
          />
        </div>
      </div>
    )
  }
}

export const Select = styled(SelectBase)`
  max-width: 100%;
  & button:disabled {
    background-color: ${(p) => p.disabled && p.theme.colors.lightGray};
    border-color: ${(p) => p.disabled && p.theme.colors.lightGray};
  }
  ${margin}
  ${styledSystemWidth}
  ${SelectTrigger} {
    ${displayStatus}
  }
`

Select.propTypes = {
  // @ts-ignore
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      })
    ),
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.number.isRequired),
  ]),
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // @ts-ignore
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  comboBox: PropTypes.bool,
  canCreateOption: PropTypes.bool,
  matchNotFoundText: PropTypes.string,
  extraLabel: PropTypes.string,
  status: StatusPropType,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  noOptionsText: PropTypes.string,
  children: function (props: Record<string, any>): Error | null {
    if (props.children && props.options) {
      return new Error('Should use `options` prop OR pass children, not both')
    }
    return null
  },
}

Select.defaultProps = {
  placeholder: 'Select an option',
  multiple: false,
  comboBox: false,
  canCreateOption: true,
  matchNotFoundText: 'No match found',
  extraLabel: '+{} more',
  noOptionsText: 'No options available',
}

export default Select
