import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'
import { NavigationChevronDown, NavigationChevronLeft } from '@repay/cactus-icons'
import { omitMargins } from '../helpers/omit'
import IconButton from '../IconButton/IconButton'
import PropTypes from 'prop-types'
import styled, { StyledComponentBase } from 'styled-components'
import useId from '../helpers/useId'

interface AccordionProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface AccordionHeaderProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  openLabel?: string
  closeLabel?: string
}

interface AccordionBodyProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface AccordionContext {
  isOpen: boolean
  handleToggle: (() => void) | undefined
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
  isManaged: boolean
}

const AccordionContext = createContext<AccordionContext>({
  isOpen: false,
  handleToggle: undefined,
})

const AccordionHeaderBase = (props: AccordionHeaderProps) => {
  const {
    className,
    children,
    openLabel,
    closeLabel,
    'aria-label': ariaLabel = 'Accordion',
  } = props
  const { isOpen, handleToggle } = useContext(AccordionContext)

  const buttonLabel = isOpen ? closeLabel || 'Close' : openLabel || 'Expand'

  return (
    <div className={className} tabIndex={0} aria-label={ariaLabel}>
      <header>{children}</header>
      <IconButton onClick={handleToggle} label={buttonLabel} iconSize="small" mx="16px">
        {isOpen ? <NavigationChevronDown /> : <NavigationChevronLeft />}
      </IconButton>
    </div>
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
  ${p => p.theme.textStyles.h3};
`

AccordionHeader.defaultProps = {
  'aria-label': 'Accordion',
  openLabel: 'Expand',
  closeLabel: 'Close',
}

// @ts-ignore
AccordionHeader.propTypes = {
  'aria-label': PropTypes.string,
  openLabel: PropTypes.string,
  closeLabel: PropTypes.string,
}

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
  const { className } = props
  const { isOpen } = useContext(AccordionContext)
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
      className={className}
      style={{
        height: outerHeight + 'px',
        transitionDuration: transitionDuration + 'ms',
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <AccordionBodyInner ref={innerRef}>{props.children}</AccordionBodyInner>
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
  isManaged: false,
})

interface AccordionProviderState {
  [key: string]: { open: boolean; order: number }
}

let order = 0

export const AccordionProvider = (props: AccordionProviderProps) => {
  const { maxOpen = 1 } = props
  const [state, setState] = useState<AccordionProviderState>({})

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

  const value: { [key: string]: { open: boolean } } = {}
  Object.keys(state).forEach(accordionId => {
    value[accordionId] = {
      open: state[accordionId].open,
    }
  })

  return (
    <ProviderContext.Provider
      value={{ accordions: value, manageOpen: manageOpen, isManaged: true }}
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
  const { accordions, manageOpen, isManaged } = useContext(ProviderContext)
  const id = useId()
  let isOpen = false
  if (isManaged) {
    isOpen = accordions[id] === undefined ? false : accordions[id].open
  }
  const [state, setState] = useState<AccordionState>({ isOpen: isOpen })

  const toggleOpen = () => {
    if (isManaged) {
      if (manageOpen && typeof manageOpen === 'function') {
        manageOpen(id, !isOpen)
      }
    } else {
      setState(state => ({ isOpen: !state.isOpen }))
    }
  }

  const rest = omitMargins(props, 'width', 'maxWidth')

  return (
    <div {...rest}>
      <AccordionContext.Provider
        value={{
          isOpen: isManaged ? isOpen : state.isOpen,
          handleToggle: toggleOpen,
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
