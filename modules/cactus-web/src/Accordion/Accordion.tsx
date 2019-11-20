import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'
import { NavigationChevronDown, NavigationChevronLeft } from '@repay/cactus-icons'
import { omitMargins } from '../helpers/omit'
import KeyCodes from '../helpers/keyCodes'
import PropTypes from 'prop-types'
import styled, { StyledComponentBase } from 'styled-components'
import useId from '../helpers/useId'

interface AccordionProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface AccordionHeaderProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

interface AccordionBodyProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface AccordionContext {
  isOpen: boolean
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
  accordions: {
    [key: string]: { open: boolean }
  }
  manageOpen: ((name: string, open: boolean) => void) | undefined
  manageFocus: ((id: string, offset: number) => void) | undefined
  focusFirst: (() => void) | undefined
  focusLast: (() => void) | undefined
  isManaged: boolean
  managedAccordions: Array<string> | undefined
}

const AccordionContext = createContext<AccordionContext>({
  isOpen: false,
  bodyId: undefined,
  headerId: undefined,
  handleToggle: undefined,
  handleFocus: undefined,
  focusFirst: undefined,
  focusLast: undefined,
})

const AccordionHeaderBase = (props: AccordionHeaderProps) => {
  const { className, children, ...rest } = props
  const { isOpen, bodyId, headerId, handleToggle, handleFocus, focusFirst, focusLast } = useContext(
    AccordionContext
  )

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
    <button
      {...rest}
      id={headerId}
      className={className}
      data-role="accordion-button"
      role="button"
      onClick={handleToggle}
      onKeyDown={handleHeaderKeyDown}
      onKeyUp={handleHeaderKeyUp}
      aria-expanded={isOpen}
      aria-controls={bodyId}
    >
      <span>{children}</span>
      {isOpen ? (
        <NavigationChevronDown iconSize="small" mx="16px" aria-hidden="true" />
      ) : (
        <NavigationChevronLeft iconSize="small" mx="16px" aria-hidden="true" />
      )}
    </button>
  )
}

export const AccordionHeader = styled(AccordionHeaderBase)`
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  padding-left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: 2px transparent;
  outline: none;

  &::-moz-focus-inner {
    border: 0;
  }

  &:focus {
    border: 2px solid ${p => p.theme.colors.callToAction};
    border-radius: 5px;
  }

  ${p => p.theme.textStyles.h3};
`

const AccordionBodyInner = styled.div`
  box-sizing: border-box;
  padding-top: 24px;
  padding-bottom: 40px;
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
  const { className, children, ...rest } = props
  const { isOpen, bodyId, headerId } = useContext(AccordionContext)
  const previousIsOpen = useRef(isOpen)
  const [state, setState] = useState<AnimationStateType>(isOpen ? 'open' : 'closed')
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (previousIsOpen.current !== isOpen) {
        setState('animating')
      }
      previousIsOpen.current = isOpen

      const currentHeight = getHeight(innerRef.current)
      if (currentHeight !== height) {
        setHeight(currentHeight)
      }
    })
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

  const outerHeight = (isOpen && state === 'animating') || state === 'open' ? height : 0
  const transitionDuration = state === 'animating' ? getDuration(getHeight(innerRef.current)) : 0
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
      <AccordionBodyInner ref={innerRef}>{children}</AccordionBodyInner>
    </div>
  ) : null
}

export const AccordionBody = styled(AccordionBodyBase)`
  box-sizing: border-box;
  overflow: hidden;
  transition: all 200ms ease-in;
`

const ProviderContext = createContext<AccordionProviderContext>({
  accordions: {},
  manageOpen: undefined,
  manageFocus: undefined,
  focusFirst: undefined,
  focusLast: undefined,
  isManaged: false,
  managedAccordions: undefined,
})

interface AccordionProviderState {
  [key: string]: { open: boolean; order: number }
}

let order = 0

export const AccordionProvider = (props: AccordionProviderProps) => {
  const { maxOpen = 1 } = props
  const [state, setState] = useState<AccordionProviderState>({})

  const managedAccordions = useRef<Array<string>>([])

  const manageOpen = (id: string, open: boolean) => {
    const newState = { ...state }
    newState[id] = { open: open, order: order++ }
    if (open) {
      const allOpen = Object.keys(newState).filter(
        accordionId => newState[accordionId].open === true
      )
      if (allOpen.length > maxOpen) {
        allOpen.sort((a, b) => {
          if (newState[a].order < newState[b].order) {
            return -1
          } else if (newState[a].order > newState[b].order) {
            return 1
          }
          return 0
        })
        newState[allOpen[0]].open = false
      }
    }
    setState(newState)
  }

  const manageFocus = (id: string, offset: number) => {
    if (managedAccordions.current.length > 1) {
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
    if (managedAccordions.current.length > 1) {
      const orderedIds = getOrderedIds()
      focusById(orderedIds[0])
    }
  }

  const focusLast = () => {
    if (managedAccordions.current.length > 1) {
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
    Array.from(document.querySelectorAll(`#${managedAccordions.current.join(',#')}`)).map(
      el => el.id
    )

  const value: { [key: string]: { open: boolean } } = {}
  Object.keys(state).forEach(accordionId => {
    value[accordionId] = {
      open: state[accordionId].open,
    }
  })

  return (
    <ProviderContext.Provider
      value={{
        accordions: value,
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
    accordions,
    manageOpen,
    manageFocus,
    focusFirst,
    focusLast,
    isManaged,
    managedAccordions,
  } = useContext(ProviderContext)
  const id = useId(props.id)
  const headerId = `${id}-header`
  const bodyId = `${id}-body`
  let isOpen = false

  if (isManaged) {
    isOpen = accordions[id] === undefined ? false : accordions[id].open
  }
  const [state, setState] = useState<AccordionState>({ isOpen: isOpen })

  useEffect(() => {
    if (managedAccordions) {
      managedAccordions.push(id)
    }
  }, [id, managedAccordions])

  useEffect(() => {
    return () => {
      if (managedAccordions) {
        const accordionIndex = managedAccordions.indexOf(id)
        managedAccordions.splice(accordionIndex, 1)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const rest = omitMargins(props, 'width', 'maxWidth')

  return (
    <div id={id} {...rest}>
      <AccordionContext.Provider
        value={{
          isOpen: isManaged ? isOpen : state.isOpen,
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

export const Accordion = styled(AccordionBase)`
  width: 100%;
  border-bottom: 2px solid ${p => p.theme.colors.lightContrast};
  ${margin}
  ${width}
  ${maxWidth}
` as any

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody
Accordion.Provider = AccordionProvider

export default Accordion as AccordionComponent
