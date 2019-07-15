import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { MarginProps, margins } from '../helpers/margins'
import { maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'
import { NavigationChevronDown, NavigationChevronLeft } from '@repay/cactus-icons'
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
  isClosing: boolean
  handleToggle: (() => void) | undefined
}

interface AccordionProviderProps {
  maxOpen?: number
  children?: React.ReactNode
}

interface AccordionProviderContext {
  accordions: {
    [key: string]: { open: boolean; closing: boolean }
  }
  manageOpen: ((name: string, open: boolean) => void) | undefined
  isManaged: boolean
}

const AccordionContext = createContext<AccordionContext>({
  isOpen: false,
  isClosing: false,
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
  const { isOpen, isClosing, handleToggle } = useContext(AccordionContext)

  const buttonLabel = isOpen ? closeLabel || 'Close' : openLabel || 'Expand'
  const borderClassName = !isOpen && !isClosing ? 'borderBottom' : ''

  return (
    <div className={`${className} ${borderClassName}`} tabIndex={0} aria-label={ariaLabel}>
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

  &.borderBottom {
    border-bottom: 2px solid ${p => p.theme.colors.lightContrast};
  }
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

const BODY_PADDING_TOP = 24
const BODY_PADDING_BOTTOM = 40

const AccordionBodyBase = (props: AccordionBodyProps) => {
  const { className } = props
  const { isOpen, isClosing } = useContext(AccordionContext)
  const [state, setState] = useState({ height: 0, paddingTop: 0, paddingBottom: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const newHeight =
        containerRef.current.getBoundingClientRect().height + BODY_PADDING_TOP + BODY_PADDING_BOTTOM
      if (newHeight !== state.height) {
        setState({
          height: newHeight,
          paddingTop: BODY_PADDING_TOP,
          paddingBottom: BODY_PADDING_BOTTOM,
        })
      }
    } else if (!isOpen) {
      setState({ height: 0, paddingTop: 0, paddingBottom: 0 })
    }
  }, [isOpen, state.height])

  return isOpen || isClosing ? (
    <div
      className={className}
      style={{
        height: `${state.height}px`,
        paddingTop: `${state.paddingTop}px`,
        paddingBottom: `${state.paddingBottom}px`,
      }}
    >
      <div ref={containerRef}>{props.children}</div>
    </div>
  ) : null
}

export const AccordionBody = styled(AccordionBodyBase)`
  box-sizing: border-box;
  overflow: hidden;
  transition: all 600ms ease-in;
  border-bottom: 2px solid ${p => p.theme.colors.lightContrast};
`

const ProviderContext = createContext<AccordionProviderContext>({
  accordions: {},
  manageOpen: undefined,
  isManaged: false,
})

interface AccordionProviderState {
  [key: string]: { open: boolean; closing: boolean; order: number }
}

let order = 0

export const AccordionProvider = (props: AccordionProviderProps) => {
  const { maxOpen = 1 } = props
  const [state, setState] = useState<AccordionProviderState>({})

  const manageOpen = (id: string, open: boolean) => {
    const newState = { ...state }
    newState[id] = { open: open, closing: !open, order: order++ }
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
        newState[allOpen[0]].closing = true
        setTimeout(() => {
          setState(state => ({ ...state, [allOpen[0]]: { ...state[allOpen[0]], closing: false } }))
        }, 600)
      }
    }
    setState(newState)
  }

  const value: { [key: string]: { open: boolean; closing: boolean } } = {}
  Object.keys(state).forEach(accordionId => {
    value[accordionId] = {
      open: state[accordionId].open,
      closing: state[accordionId].closing,
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
  isClosing: boolean
}

const AccordionBase = (props: AccordionProps) => {
  const { accordions, manageOpen, isManaged } = useContext(ProviderContext)
  const id = useId()
  let isOpen = false
  let isClosing = false
  if (isManaged) {
    isOpen = accordions[id] === undefined ? false : accordions[id].open
    isClosing = accordions[id] === undefined ? false : accordions[id].closing
  }
  const [state, setState] = useState<AccordionState>({ isOpen: isOpen, isClosing: isClosing })

  useEffect(() => {
    if (state.isClosing) {
      setTimeout(() => {
        setState(state => ({ ...state, isClosing: false }))
      }, 600)
    }
  }, [state.isClosing])

  const toggleOpen = () => {
    if (isManaged) {
      if (manageOpen && typeof manageOpen === 'function') {
        manageOpen(id, !isOpen)
      }
    } else {
      setState(state => ({ isOpen: !state.isOpen, isClosing: state.isOpen }))
    }
  }

  return (
    <div {...props}>
      <AccordionContext.Provider
        value={{
          isOpen: isManaged ? isOpen : state.isOpen,
          isClosing: isManaged ? isClosing : state.isClosing,
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
  ${margins}
  ${width}
  ${maxWidth}
` as any

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody
Accordion.Provider = AccordionProvider

export default Accordion as AccordionComponent
