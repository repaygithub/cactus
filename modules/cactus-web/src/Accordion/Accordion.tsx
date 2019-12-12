import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { assignRef } from '@reach/utils'
import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'
import { NavigationChevronDown, NavigationChevronRight } from '@repay/cactus-icons'
import { omitMargins } from '../helpers/omit'
import IconButton from '../IconButton/IconButton'
import KeyCodes from '../helpers/keyCodes'
import PropTypes from 'prop-types'
import Rect from '@reach/rect'
import styled, { css, StyledComponentBase } from 'styled-components'
import useId from '../helpers/useId'

type AccordionVariants = 'simple' | 'outline'

type VariantMap = { [K in AccordionVariants]: ReturnType<typeof css> }

interface AccordionProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  defaultOpen?: boolean
  variant?: AccordionVariants
}

interface AccordionHeaderProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  render?: (opts: { isOpen: boolean; headerId: string }) => JSX.Element
}

interface AccordionBodyProps
  extends MarginProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface AccordionContext {
  isOpen: boolean
  variant: string | undefined
  bodyId: string | undefined
  headerId: string | undefined
  handleToggle: (() => void) | undefined
  handleFocus: ((offset: number) => void) | undefined
  focusFirst: (() => void) | undefined
  focusLast: (() => void) | undefined
}

interface AccordionProviderProps {
  maxOpen?: number
  children?: React.ReactNode
}

interface AccordionProviderContext {
  manageOpen: ((name: string, open: boolean) => void) | undefined
  manageFocus: ((id: string, offset: number) => void) | undefined
  focusFirst: (() => void) | undefined
  focusLast: (() => void) | undefined
  isManaged: boolean
  managedAccordions: { [key: string]: { open: boolean; order: number } } | undefined
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

const AccordionHeaderBase = (props: AccordionHeaderProps) => {
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

  // Used to prevent default behavior/propagation
  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const key = event.which || event.keyCode
    if ([KeyCodes.UP, KeyCodes.DOWN, KeyCodes.HOME, KeyCodes.END, KeyCodes.RETURN].includes(key)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const handleHeaderKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
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
      onClick={handleToggle}
    >
      <IconButton
        iconSize="small"
        mr={4}
        onKeyDown={handleHeaderKeyDown}
        onKeyUp={handleHeaderKeyUp}
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
      border-bottom: 1px solid ${p => p.theme.colors.lightContrast};
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

const getHeight = (element: Element | null) => {
  if (element !== null) {
    const { height } = element.getBoundingClientRect()
    return height
  }
  return 0
}

/**
 * determines animation duration based on pixels travelled with
 * a min of 200ms and max of 700ms otherwise x / 2 + 100
 */
const getDuration = (delta: number) => Math.min(Math.max(Math.abs(delta / 2) + 100, 200), 700)

type AnimationStateType = 'open' | 'animating' | 'closed'

const AccordionBodyBase = (props: AccordionBodyProps) => {
  const { className, children, ...restProps } = props
  const { isOpen, variant, bodyId, headerId } = useContext(AccordionContext)
  const previousIsOpen = useRef(isOpen)
  const [state, setState] = useState<AnimationStateType>(isOpen ? 'open' : 'closed')
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let isSubscribed = true
    window.requestAnimationFrame(() => {
      if (previousIsOpen.current !== isOpen && isSubscribed) {
        setState('animating')
      }
      previousIsOpen.current = isOpen

      const currentHeight = getHeight(innerRef.current)
      if (currentHeight !== height && isSubscribed) {
        setHeight(currentHeight)
      }
    })
    return () => {
      isSubscribed = false
    }
  })

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (getHeight(event.currentTarget) === 0) {
        setState('closed')
      } else {
        setState('open')
      }
    },
    [setState]
  )

  const handleRectChange = (rect: DOMRect) => {
    if (rect.height !== height) {
      setHeight(rect.height)
    }
  }

  const outerHeight = (isOpen && state === 'animating') || state === 'open' ? height : 0
  const transitionDuration = state === 'animating' ? getDuration(getHeight(innerRef.current)) : 0
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
        {({ ref }) => {
          const mergeRefs = (n: HTMLDivElement | null) => {
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
  managedAccordions: undefined,
})

let order = 0

export const AccordionProvider = (props: AccordionProviderProps) => {
  const { maxOpen = 1 } = props
  const [update, makeUpdate] = useState<boolean>(false)

  const managedAccordions = useRef<{ [key: string]: { open: boolean; order: number } }>({})

  const manageOpen = (id: string, open: boolean) => {
    managedAccordions.current[id] = { open: open, order: order++ }
    const accordions = managedAccordions.current
    if (open) {
      const allOpen = Object.keys(accordions).filter(
        accordionId => accordions[accordionId].open === true
      )
      if (allOpen.length > maxOpen) {
        allOpen.sort((a, b) => {
          if (accordions[a].order < accordions[b].order) {
            return -1
          } else if (accordions[a].order > accordions[b].order) {
            return 1
          }
          return 0
        })
        managedAccordions.current[allOpen[0]].open = false
      }
    }
    makeUpdate(!update)
  }

  const manageFocus = (id: string, offset: number) => {
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

  const focusFirst = () => {
    if (Object.keys(managedAccordions.current).length > 1) {
      const orderedIds = getOrderedIds()
      focusById(orderedIds[0])
    }
  }

  const focusLast = () => {
    if (Object.keys(managedAccordions.current).length > 1) {
      const orderedIds = getOrderedIds()
      focusById(orderedIds[orderedIds.length - 1])
    }
  }

  const focusById = (id: string) => {
    const focusAccordion = document.getElementById(id)
    if (focusAccordion) {
      const toFocus = focusAccordion.querySelector(
        'button[data-role="accordion-button"]'
      ) as HTMLElement
      toFocus.focus()
    }
  }

  const getOrderedIds = () =>
    Array.from(
      document.querySelectorAll(`#${Object.keys(managedAccordions.current).join(',#')}`)
    ).map(el => el.id)

  return (
    <ProviderContext.Provider
      value={{
        manageOpen,
        manageFocus,
        focusFirst,
        focusLast,
        isManaged: true,
        managedAccordions: managedAccordions.current,
      }}
    >
      {props.children}
    </ProviderContext.Provider>
  )
}

AccordionProvider.defaultProps = {
  maxOpen: 1,
}

AccordionProvider.propTypes = {
  maxOpen: PropTypes.number,
}

interface AccordionComponent extends StyledComponentBase<'div', CactusTheme, AccordionProps> {
  Header: React.ComponentType<AccordionHeaderProps>
  Body: React.ComponentType<AccordionBodyProps>
  Provider: React.ComponentType<AccordionProviderProps>
}

interface AccordionState {
  isOpen: boolean
}

const AccordionBase = (props: AccordionProps) => {
  const {
    manageOpen,
    manageFocus,
    focusFirst,
    focusLast,
    isManaged,
    managedAccordions,
  } = useContext(ProviderContext)
  const { defaultOpen, variant, className, ...restProps } = props
  const id = useId(props.id)
  const headerId = `${id}-header`
  const bodyId = `${id}-body`
  let isOpen = defaultOpen || false

  if (isManaged && managedAccordions !== undefined && managedAccordions[id] !== undefined) {
    isOpen = managedAccordions[id].open
  }
  const [state, setState] = useState<AccordionState>({ isOpen: isOpen })

  useEffect(() => {
    if (isManaged && typeof manageOpen === 'function') {
      manageOpen(id, defaultOpen || false)
    }
  }, [defaultOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (managedAccordions) {
      managedAccordions[id] = { open: isOpen, order: order++ }
    }
    return () => {
      if (managedAccordions) {
        delete managedAccordions[id]
      }
    }
  }, [id, managedAccordions]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOpen = () => {
    if (isManaged) {
      if (manageOpen && typeof manageOpen === 'function') {
        manageOpen(id, !isOpen)
      }
    } else {
      setState(state => ({ ...state, isOpen: !state.isOpen }))
    }
  }

  const shiftFocus = (offset: number) => {
    if (isManaged && typeof manageFocus === 'function') {
      manageFocus(id, offset)
    }
  }

  const focusFirstAccordion = () => {
    if (isManaged && typeof focusFirst === 'function') {
      focusFirst()
    }
  }

  const focusLastAccordion = () => {
    if (isManaged && typeof focusLast === 'function') {
      focusLast()
    }
  }

  const rest = omitMargins(restProps, 'width', 'maxWidth')
  const open = isManaged ? isOpen : state.isOpen

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

const accordionVariantMap: VariantMap = {
  simple: css`
    border-bottom: 2px solid ${p => p.theme.colors.lightContrast};
    &:first-of-type {
      border-top: 2px solid ${p => p.theme.colors.lightContrast};
    }
  `,
  outline: css`
    border: 2px solid ${p => p.theme.colors.lightContrast};
    border-radius: 8px;
    & + & {
      margin-top: 8px;
    }
  `,
}

const variantStyles = (props: AccordionProps) => {
  if (props.variant !== undefined) {
    return accordionVariantMap[props.variant]
  }
}

export const Accordion = styled(AccordionBase)`
  box-sizing: border-box;
  width: 100%;

  &.box-shadow {
    border: 0px;
    box-shadow: 0 3px 8px ${p => p.theme.colors.callToAction};
  }

  ${variantStyles}
  ${margin}
  ${width}
  ${maxWidth}
` as any

Accordion.defaultProps = {
  defaultOpen: false,
  variant: 'simple',
}

Accordion.propTypes = {
  defaultOpen: PropTypes.bool,
  variant: PropTypes.oneOf(['simple', 'outline']),
}

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody
Accordion.Provider = AccordionProvider

export default Accordion as AccordionComponent
