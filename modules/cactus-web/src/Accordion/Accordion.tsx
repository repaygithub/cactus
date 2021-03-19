import Rect, { PRect } from '@reach/rect'
import { assignRef } from '@reach/utils'
import { NavigationChevronDown, NavigationChevronRight } from '@repay/cactus-icons'
import { BorderSize } from '@repay/cactus-theme'
import { CactusTheme } from '@repay/cactus-theme'
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
import styled, { css, StyledComponentBase } from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

import KeyCodes from '../helpers/keyCodes'
import { omitMargins } from '../helpers/omit'
import { boxShadow, radius } from '../helpers/theme'
import useId from '../helpers/useId'
import IconButton from '../IconButton/IconButton'

export type AccordionVariants = 'simple' | 'outline'

type VariantMap = { [K in AccordionVariants]: ReturnType<typeof css> }

interface AccordionProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
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

const getBoxShadow = (theme: CactusTheme, useBoxShadows?: boolean): ReturnType<typeof css> => {
  return theme.boxShadows && useBoxShadows
    ? css`
        border: 0px;
        ${(p): string => `${boxShadow(p.theme, 1)}`}
      `
    : css``
}

const AccordionHeaderBase = (props: AccordionHeaderProps): ReactElement => {
  const { className, children, render, ...rest } = props
  const {
    isOpen,
    variant,
    bodyId,
    headerId,
    handleToggle,
    handleFocus,
    focusFirst,
    focusLast,
  } = useContext(AccordionContext)

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
      className={`${className} ${variant === 'outline' ? 'outline-variant' : ''} ${
        isOpen ? 'is-open' : ''
      }`}
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

const headerBorderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border-bottom: 1px solid;
  `,
  thick: css`
    border-bottom: 2px solid;
  `,
}

const getHeaderBorder = (borderSize: BorderSize): ReturnType<typeof css> =>
  headerBorderMap[borderSize]

export const AccordionHeader = styled(AccordionHeaderBase)`
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: 2px transparent;
  outline: none;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  ::after {
    content: '';
    min-height: inherit;
    font-size: 0;
  }

  > :not(:first-child) {
    width: 100%;
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

  &.outline-variant {
    padding-left: 16px;
    padding-right: 16px;

    &.is-open {
      ${(p): ReturnType<typeof css> => getHeaderBorder(p.theme.border)}
      border-color: ${(p): string => p.theme.colors.lightContrast};
    }
  }
`

const AccordionBodyInner = styled.div`
  box-sizing: border-box;
  padding-top: 24px;
  padding-bottom: 40px;

  &.pad-x {
    padding-left: 40px;
    padding-right: 40px;
  }
`

const getHeight = (element: Element | null): number => {
  if (element !== null) {
    const { height } = element.getBoundingClientRect()
    return height
  }
  return 0
}

type AnimationStateType = 'open' | 'animating' | 'closed'

const AccordionBodyBase = (props: AccordionBodyProps): ReactElement | null => {
  const { className, children, ...restProps } = props
  const { isOpen, variant, bodyId, headerId } = useContext(AccordionContext)
  const previousIsOpen = useRef(isOpen)
  const [state, setState] = useState<AnimationStateType>(isOpen ? 'open' : 'closed')
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect((): (() => void) => {
    let isSubscribed = true
    window.requestAnimationFrame((): void => {
      if (previousIsOpen.current !== isOpen && isSubscribed) {
        setState('animating')
        previousIsOpen.current = isOpen
      }

      const currentHeight = getHeight(innerRef.current)
      if (currentHeight !== height && isSubscribed) {
        setHeight(currentHeight)
      }
    })
    return (): void => {
      isSubscribed = false
    }
  })

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>): void => {
      if (getHeight(event.currentTarget) === 0) {
        setState('closed')
      } else {
        setState('open')
      }
    },
    [setState]
  )

  const handleRectChange = (rect: PRect): void => {
    if (rect.height !== height) {
      setHeight(rect.height)
    }
  }

  const outerHeight = (isOpen && state === 'animating') || state === 'open' ? height : 0
  const transitionDuration = state === 'animating' ? 200 : 0
  const rest = omitMargins(restProps, 'width', 'maxWidth')
  return state !== 'closed' ? (
    <div
      {...rest}
      id={bodyId}
      className={className}
      tabIndex={typeof children === 'string' ? 0 : undefined}
      style={{
        height: outerHeight + 'px',
        transitionDuration: transitionDuration + 'ms',
      }}
      onTransitionEnd={handleTransitionEnd}
      role="region"
      aria-labelledby={headerId}
    >
      <Rect observe={state === 'open'} onChange={handleRectChange}>
        {({ ref }): ReactElement => {
          const mergeRefs = (n: HTMLDivElement | null): void => {
            innerRef.current = n
            assignRef(ref, n)
          }
          return (
            <AccordionBodyInner
              className={`${variant === 'outline' ? 'pad-x' : ''}`}
              ref={mergeRefs}
            >
              {children}
            </AccordionBodyInner>
          )
        }}
      </Rect>
    </div>
  ) : null
}

export const AccordionBody = styled(AccordionBodyBase)`
  box-sizing: border-box;
  overflow: hidden;
  transition: all 200ms ease-in;
  ${margin}
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

interface AccordionState {
  isOpen: boolean
}

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
  const { defaultOpen = false, variant, className, useBoxShadows, ...restProps } = props
  const id = useId(props.id)
  const headerId = `${id}-header`
  const bodyId = `${id}-body`

  const [unmanagedState, setUnmanagedState] = useState<AccordionState>({ isOpen: defaultOpen })
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
      setUnmanagedState((state): AccordionState => ({ ...state, isOpen: !state.isOpen }))
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

  const rest = omitMargins(restProps, 'width', 'maxWidth')
  const open = isManaged ? getManagedOpen() : unmanagedState.isOpen

  return (
    <div
      id={id}
      className={`${className} ${open && variant === 'outline' ? 'box-shadow' : ''}`}
      {...rest}
    >
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

const outlineBorderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const simpleBorderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border-bottom: 1px solid;
    &:first-of-type {
      border-top: 1px solid ${(p): string => p.theme.colors.lightContrast};
    }
  `,
  thick: css`
    border-bottom: 2px solid;
    &:first-of-type {
      border-top: 2px solid ${(p): string => p.theme.colors.lightContrast};
    }
  `,
}

const getOutlineBorder = (borderSize: BorderSize) => outlineBorderMap[borderSize]
const getSimpleBorder = (borderSize: BorderSize) => simpleBorderMap[borderSize]

const accordionVariantMap: VariantMap = {
  simple: css`
    ${(p): ReturnType<typeof css> => getSimpleBorder(p.theme.border)}
    border-color: ${(p): string => p.theme.colors.lightContrast};
  `,
  outline: css`
    ${(p): ReturnType<typeof css> => getOutlineBorder(p.theme.border)}
    border-color: ${(p): string => p.theme.colors.lightContrast};
    border-radius: ${radius(8)};
    & + & {
      margin-top: 8px;
    }
  `,
}

const variantStyles = (props: AccordionProps): ReturnType<typeof css> | undefined => {
  if (props.variant !== undefined) {
    return accordionVariantMap[props.variant]
  }
}

export const Accordion = styled(AccordionBase)`
  box-sizing: border-box;
  width: 100%;

  &.box-shadow {
    ${(p): ReturnType<typeof css> => getBoxShadow(p.theme, p.useBoxShadows)}
  }

  ${variantStyles}
  ${margin}
  ${width}
  ${maxWidth}
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
