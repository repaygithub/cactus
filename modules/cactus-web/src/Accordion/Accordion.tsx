import { NavigationChevronDown, NavigationChevronRight } from '@repay/cactus-icons'
import { border, CactusTheme, radius, shadow, space } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Transition } from 'react-transition-group'
import styled, { StyledComponentBase } from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

import { flexItem, FlexItemProps } from '../helpers/flexItem'
import KeyCodes from '../helpers/keyCodes'
import { omitProps } from '../helpers/omit'
import useId from '../helpers/useId'
import IconButton from '../IconButton/IconButton'

export type AccordionVariants = 'simple' | 'outline'

interface AccordionProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
    FlexItemProps,
    React.HTMLAttributes<HTMLDivElement> {
  /** Does not apply when Accordion descends from a controlled Provider.  If true, the
   * Accordion will begin in the open state when first rendered.
   */
  defaultOpen?: boolean
  variant?: AccordionVariants
  useBoxShadows?: boolean
}

interface AccordionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: (opts: { isOpen: boolean; headerId: string }) => JSX.Element
}

interface AccordionBodyProps extends MarginProps, React.HTMLAttributes<HTMLDivElement> {}

interface AccordionContext {
  isOpen: boolean
  variant?: string
  bodyId?: string
  headerId?: string
  handleToggle?: () => void
  handleFocus?: (offset: number) => void
  focusFirst?: () => void
  focusLast?: () => void
}

interface AccordionProviderProps {
  /** Only used in uncontrolled variant.  Determines maximum number of Accordions that
   * can be open at one time.
   */
  maxOpen?: number
  /** Only used in controlled variant.  Contains the IDs of all Accordions that should be
   * in an open state.
   */
  openId?: string | string[]
  /** Called whenever an Accordion is toggled from open to closed or vice versa.  The ID
   * of the toggled Accordion is passed to the function.
   */
  onChange?: (changedId: string) => void
  children?: React.ReactNode
}

interface ManagedAccordions {
  [key: string]: { order: number }
}

interface AccordionProviderContext {
  manageOpen?: (name: string, open: boolean) => void
  manageFocus?: (id: string, offset: number) => void
  focusFirst?: () => void
  focusLast?: () => void
  isManaged: boolean
  isControlled: boolean
  openAccordions?: string[]
  registerAccordion?: (id: string, defaultOpen: boolean) => void
  unregisterAccordion?: (id: string) => void
}

const AccordionContext = createContext<AccordionContext>({
  isOpen: false,
  variant: undefined,
  bodyId: undefined,
  headerId: undefined,
  handleToggle: undefined,
  handleFocus: undefined,
  focusFirst: undefined,
  focusLast: undefined,
})

const AccordionHeaderBase = (props: AccordionHeaderProps): ReactElement => {
  const { children, render, ...rest } = props
  const { isOpen, bodyId, headerId, handleToggle, handleFocus, focusFirst, focusLast } =
    useContext(AccordionContext)

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    let element: HTMLElement | null = event.target as HTMLElement
    do {
      if (element.tagName === 'BUTTON') return
      element = element.parentElement
    } while (element !== null && element !== event.currentTarget)
    if (handleToggle && typeof handleToggle === 'function') {
      handleToggle()
    }
  }

  // Used to prevent default behavior/propagation
  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    const key = event.which || event.keyCode
    if ([KeyCodes.UP, KeyCodes.DOWN, KeyCodes.HOME, KeyCodes.END, KeyCodes.RETURN].includes(key)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const handleHeaderKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    const key = event.which || event.keyCode
    switch (key) {
      case KeyCodes.SPACE:
      case KeyCodes.RETURN: {
        event.preventDefault()
        event.stopPropagation()
        if (handleToggle && typeof handleToggle === 'function') {
          handleToggle()
        }
        break
      }
      case KeyCodes.UP:
      case KeyCodes.DOWN: {
        event.preventDefault()
        event.stopPropagation()
        if (handleFocus && typeof handleFocus === 'function') {
          const offset = key === KeyCodes.UP ? -1 : 1
          handleFocus(offset)
        }
        break
      }
      case KeyCodes.HOME: {
        event.preventDefault()
        event.stopPropagation()
        if (focusFirst && typeof focusFirst === 'function') {
          focusFirst()
        }
        break
      }
      case KeyCodes.END: {
        event.preventDefault()
        event.stopPropagation()
        if (focusLast && typeof focusLast === 'function') {
          focusLast()
        }
        break
      }
    }
  }

  return (
    <div
      {...rest}
      id={typeof render !== 'function' ? headerId : undefined}
      onClick={handleHeaderClick}
    >
      <IconButton
        iconSize="small"
        mr={4}
        onKeyDown={handleHeaderKeyDown}
        onKeyUp={handleHeaderKeyUp}
        onClick={handleToggle}
        data-role="accordion-button"
        type="button"
        role="button"
        aria-expanded={isOpen}
        aria-controls={bodyId}
        aria-labelledby={headerId}
      >
        {isOpen ? (
          <NavigationChevronDown aria-hidden="true" />
        ) : (
          <NavigationChevronRight aria-hidden="true" />
        )}
      </IconButton>
      {typeof render === 'function' && headerId !== undefined
        ? render({ isOpen, headerId })
        : children}
    </div>
  )
}

// Not sure we actually need the min-height now I've added padding, but don't want to risk it.
export const AccordionHeader = styled(AccordionHeaderBase)`
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  padding: ${space(3)} 0;

  > :not(:first-child) {
    min-width: 1px;
    flex: 1;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  p,
  h1,
  h2,
  h3,
  h4 {
    margin: 0;
  }
`

const TIMEOUT = 200
// CSSTransition does some of this for you, but unfortunately it can't do
// transitions with `auto` height; we have to get the height dynamically.
const TRANSITION = {
  timeout: TIMEOUT,
  style: { overflow: 'hidden', width: '100%', transition: `height ${TIMEOUT}ms ease-in` },
  onEnter: function (this: { height: number }, node: HTMLElement) {
    this.height = node.getBoundingClientRect().height
    node.style.height = '0'
    node.scrollTop // Force reflow.
  },
  onEntering: function (this: { height: number }, node: HTMLElement) {
    node.style.height = `${this.height}px`
  },
  onEntered: (node: HTMLElement) => {
    node.style.height = ''
  },
  onExit: (node: HTMLElement) => {
    node.style.height = `${node.getBoundingClientRect().height}px`
    node.scrollTop // Force reflow.
  },
  onExiting: (node: HTMLElement) => {
    node.style.height = '0'
  },
  onExited: (node: HTMLElement) => {
    node.style.height = ''
  },
}

const useTransition = () => {
  const ref = useRef(TRANSITION)
  if (ref.current === TRANSITION) {
    const height = { height: 0 }
    ref.current = {
      ...ref.current,
      onEnter: TRANSITION.onEnter.bind(height),
      onEntering: TRANSITION.onEntering.bind(height),
    }
  }
  return ref.current
}

const AccordionBodyBase = (props: AccordionBodyProps): ReactElement | null => {
  const { isOpen, bodyId, headerId } = useContext(AccordionContext)
  const transition = useTransition()
  return (
    <Transition {...transition} in={isOpen} unmountOnExit>
      <div>
        <div
          {...props}
          id={bodyId}
          tabIndex={typeof props.children === 'string' ? 0 : undefined}
          role="region"
          aria-labelledby={headerId}
        />
      </div>
    </Transition>
  )
}

export const AccordionBody = styled(AccordionBodyBase).withConfig(
  omitProps<AccordionBodyProps>(margin, 'width')
)`
  margin-top: ${space(5)};
  margin-bottom: ${space(7)};
  // The extra specificity is to override the defaults in variantStyles.
  &&& {
    ${margin}
  }
`

const ProviderContext = createContext<AccordionProviderContext>({
  manageOpen: undefined,
  manageFocus: undefined,
  focusFirst: undefined,
  focusLast: undefined,
  isManaged: false,
  isControlled: false,
  openAccordions: undefined,
  registerAccordion: undefined,
  unregisterAccordion: undefined,
})

let order = 0

export const AccordionProvider = (props: AccordionProviderProps): ReactElement => {
  const { maxOpen = 1, onChange, openId } = props
  const isControlled = typeof openId !== 'undefined'

  const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>([])
  const openAccordions = useMemo(() => {
    if (isControlled) {
      const openIds = Array.isArray(openId) ? openId : [openId]
      return openIds as string[]
    }
    return uncontrolledOpen
  }, [isControlled, openId, uncontrolledOpen])

  const managedAccordions = useRef<ManagedAccordions>({})

  useEffect(() => {
    const closeOldestOpenAccordion = () => {
      const accordions = managedAccordions.current
      let allOpen = uncontrolledOpen.filter((o) => Object.keys(accordions).includes(o))
      allOpen.sort((a, b): number => {
        if (accordions[a].order < accordions[b].order) {
          return -1
        } else if (accordions[a].order > accordions[b].order) {
          return 1
        }
        return 0
      })

      const accordionToClose = allOpen[0]
      allOpen = allOpen.slice(1)
      onChange?.(accordionToClose)
      setUncontrolledOpen(allOpen)
    }

    if (!isControlled) {
      if (uncontrolledOpen.length > maxOpen) {
        closeOldestOpenAccordion()
      }
    }
  }, [isControlled, maxOpen, onChange, uncontrolledOpen])

  const registerAccordion = useCallback(
    (id: string, defaultOpen: boolean) => {
      managedAccordions.current[id] = { order: order++ }
      if (!isControlled) {
        setUncontrolledOpen((previousOpen) => {
          if (!defaultOpen || previousOpen.includes(id)) {
            return previousOpen
          }
          return [...previousOpen, id]
        })
      }
    },
    [isControlled]
  )

  const unregisterAccordion = useCallback((id: string) => {
    setUncontrolledOpen((previousOpen) => previousOpen.filter((o) => o !== id))
    delete managedAccordions.current[id]
  }, [])

  const manageOpen = useCallback(
    (id: string, open: boolean): void => {
      onChange?.(id)
      if (!isControlled) {
        managedAccordions.current[id] = { order: order++ }
        setUncontrolledOpen((previousOpen) => {
          if (open) {
            return [...previousOpen, id]
          }
          return previousOpen.filter((existingId) => existingId !== id)
        })
      }
    },
    [isControlled, onChange]
  )

  const focusById = (id: string): void => {
    const focusAccordion = document.getElementById(id)
    if (focusAccordion) {
      const toFocus = focusAccordion.querySelector(
        'button[data-role="accordion-button"]'
      ) as HTMLElement
      toFocus.focus()
    }
  }

  const getOrderedIds = (): string[] =>
    Array.from(
      document.querySelectorAll(`#${Object.keys(managedAccordions.current).join(',#')}`)
    ).map((el): string => el.id)

  const manageFocus = (id: string, offset: number): void => {
    if (Object.keys(managedAccordions.current).length > 1) {
      const orderedIds = getOrderedIds()
      const currentIndex = orderedIds.indexOf(id)
      let nextIndex = currentIndex + offset
      if (nextIndex < 0) {
        nextIndex = orderedIds.length - 1
      } else if (nextIndex >= orderedIds.length) {
        nextIndex = 0
      }
      focusById(orderedIds[nextIndex])
    }
  }

  const focusFirst = (): void => {
    if (Object.keys(managedAccordions.current).length > 1) {
      const orderedIds = getOrderedIds()
      focusById(orderedIds[0])
    }
  }

  const focusLast = (): void => {
    if (Object.keys(managedAccordions.current).length > 1) {
      const orderedIds = getOrderedIds()
      focusById(orderedIds[orderedIds.length - 1])
    }
  }

  return (
    <ProviderContext.Provider
      value={{
        manageOpen,
        manageFocus,
        focusFirst,
        focusLast,
        isManaged: true,
        isControlled,
        openAccordions,
        registerAccordion,
        unregisterAccordion,
      }}
    >
      {props.children}
    </ProviderContext.Provider>
  )
}

AccordionProvider.propTypes = {
  maxOpen: (
    props: AccordionProviderProps,
    name: keyof AccordionProviderProps,
    compName: string
  ) => {
    const val = props[name]
    if (val) {
      if (props.openId) {
        return new Error(
          'You provided a maxOpen prop to a controlled AccordionProvider.  This prop only has an effect on uncontrolled providers.'
        )
      }

      if (typeof val !== 'number') {
        return new Error(
          `Invalid prop "${name}" supplied to "${compName}". Expected "number", received "${
            Array.isArray(val) ? 'array' : typeof val
          }".`
        )
      }
    }

    return null
  },
  onChange: PropTypes.func,
  openId: (props: AccordionProviderProps, name: keyof AccordionProviderProps, compName: string) => {
    const val = props[name]
    if (val) {
      if (!props.onChange) {
        return new Error(
          'You provided an openId prop to AccordionProvider without an onChange handler. This will render a read-only accordion element. If the accordion should be functional, remove the index value to render an uncontrolled accordion or set an onChange handler to set an index when a change occurs.'
        )
      }

      if (Array.isArray(val)) {
        return val.some((i: any) => typeof i !== 'string')
          ? new Error(
              'You provided an array as an openId in AccordionProvider but one or more of the values are not strings. Please check to make sure all openId values are valid strings.'
            )
          : null
      } else if (typeof val !== 'string') {
        return new Error(
          `Invalid prop "${name}" supplied to "${compName}". Expected "string" or "string[]", received "${
            Array.isArray(val) ? 'array' : typeof val
          }".`
        )
      }
    }

    return null
  },
}

interface AccordionComponent extends StyledComponentBase<'div', CactusTheme, AccordionProps> {
  Header: React.ComponentType<AccordionHeaderProps>
  Body: React.ComponentType<AccordionBodyProps>
  Provider: React.ComponentType<AccordionProviderProps>
}

const toggle = (state: boolean) => !state

const AccordionBase = (props: AccordionProps): ReactElement => {
  const {
    manageOpen,
    manageFocus,
    focusFirst,
    focusLast,
    isManaged,
    isControlled,
    openAccordions,
    registerAccordion,
    unregisterAccordion,
  } = useContext(ProviderContext)
  const { defaultOpen = false, variant, ...restProps } = props
  const id = useId(props.id)
  const headerId = `${id}-header`
  const bodyId = `${id}-body`

  const [unmanagedState, toggleUnmanagedState] = React.useReducer(toggle, defaultOpen)
  const isInitialRender = useRef<boolean>(true)

  useEffect((): (() => void) => {
    isInitialRender.current = true
    if (isManaged) {
      registerAccordion?.(id, defaultOpen)
    }
    return (): void => {
      unregisterAccordion?.(id)
    }
  }, [defaultOpen, id, isManaged, registerAccordion, unregisterAccordion])

  useEffect(() => {
    isInitialRender.current = false
  })

  if (process.env.NODE_ENV !== 'production' && isControlled && defaultOpen) {
    console.warn(
      'The defaultOpen prop on Accordion has no effect when the state of the component is controlled.'
    )
  }

  const getManagedOpen = () => {
    if (!isControlled && isInitialRender.current) {
      return defaultOpen
    }
    return openAccordions ? openAccordions.includes(id) : false
  }

  const toggleOpen = (): void => {
    if (isManaged) {
      manageOpen?.(id, !getManagedOpen())
    } else {
      toggleUnmanagedState()
    }
  }

  const shiftFocus = (offset: number): void => {
    if (isManaged) {
      manageFocus?.(id, offset)
    }
  }

  const focusFirstAccordion = (): void => {
    if (isManaged) {
      focusFirst?.()
    }
  }

  const focusLastAccordion = (): void => {
    if (isManaged) {
      focusLast?.()
    }
  }

  const open = isManaged ? getManagedOpen() : unmanagedState

  return (
    <div id={id} aria-expanded={open} {...restProps}>
      <AccordionContext.Provider
        value={{
          isOpen: open,
          variant: variant || 'simple',
          bodyId,
          headerId,
          handleToggle: toggleOpen,
          handleFocus: shiftFocus,
          focusFirst: focusFirstAccordion,
          focusLast: focusLastAccordion,
        }}
      >
        {props.children}
      </AccordionContext.Provider>
    </div>
  )
}

const variantStyles = (props: AccordionProps & { theme: CactusTheme }): string => {
  const borderCSS = border(props, 'lightContrast')
  if (props.variant === 'outline') {
    let shadowCSS = (props.useBoxShadows && shadow(props, 1)) || ''
    if (shadowCSS) shadowCSS += 'border: none;'
    return `
      border: ${borderCSS};
      border-radius: ${radius(props, 8)};

      &[aria-expanded='true'] {
        ${shadowCSS}
        ${AccordionHeader} {
          border-bottom: ${borderCSS};
        }
      }

      & + ${Accordion} {
        margin-top: ${space(props, 3)};
      }

      ${AccordionHeader} {
        padding-left: ${space(props, 4)};
        padding-right: ${space(props, 4)};
      }
      ${AccordionBody} {
        margin-left: ${space(props, 7)};
        margin-right: ${space(props, 7)};
      }
    `
  }
  return `
    border-bottom: ${borderCSS};
    &:first-of-type {
      border-top: ${borderCSS};
    }
  `
}

export const Accordion = styled(AccordionBase).withConfig(
  omitProps<AccordionProps>(flexItem, margin, width, maxWidth, 'useBoxShadows')
)`
  box-sizing: border-box;
  width: 100%;

  ${variantStyles}
  ${margin}
  ${width}
  ${maxWidth}
  ${flexItem}
` as any

Accordion.defaultProps = {
  defaultOpen: false,
  variant: 'simple',
  useBoxShadows: true,
}

Accordion.propTypes = {
  defaultOpen: PropTypes.bool,
  variant: PropTypes.oneOf(['simple', 'outline']),
  useBoxShadows: PropTypes.bool,
}

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody
Accordion.Provider = AccordionProvider

export default Accordion as AccordionComponent
