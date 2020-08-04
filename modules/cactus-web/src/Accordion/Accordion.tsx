import Rect, { PRect } from '@reach/rect'
import { assignRef } from '@reach/utils'
import { NavigationChevronDown, NavigationChevronRight } from '@repay/cactus-icons'
import { BorderSize, Shape } from '@repay/cactus-theme'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled, { css, StyledComponentBase } from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

import KeyCodes from '../helpers/keyCodes'
import { omitMargins } from '../helpers/omit'
import { boxShadow } from '../helpers/theme'
import useId from '../helpers/useId'
import IconButton from '../IconButton/IconButton'

export type AccordionVariants = 'simple' | 'outline'

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

/**
 * determines animation duration based on pixels travelled with
 * a min of 200ms and max of 700ms otherwise x / 2 + 100
 */
const getDuration = (delta: number): number =>
  Math.min(Math.max(Math.abs(delta / 2) + 100, 200), 700)

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
      }
      previousIsOpen.current = isOpen

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
  managedAccordions: undefined,
})

let order = 0

export const AccordionProvider = (props: AccordionProviderProps): ReactElement => {
  const { maxOpen = 1 } = props
  const [update, makeUpdate] = useState<boolean>(false)

  const managedAccordions = useRef<{ [key: string]: { open: boolean; order: number } }>({})

  const manageOpen = (id: string, open: boolean): void => {
    managedAccordions.current[id] = { open: open, order: order++ }
    const accordions = managedAccordions.current
    if (open) {
      const allOpen = Object.keys(accordions).filter(
        (accordionId): boolean => accordions[accordionId].open === true
      )
      if (allOpen.length > maxOpen) {
        allOpen.sort((a, b): number => {
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

const AccordionBase = (props: AccordionProps): ReactElement => {
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

  useEffect((): void => {
    if (isManaged && typeof manageOpen === 'function') {
      manageOpen(id, defaultOpen || false)
    }
  }, [defaultOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): (() => void) => {
    if (managedAccordions) {
      managedAccordions[id] = { open: isOpen, order: order++ }
    }
    return (): void => {
      if (managedAccordions) {
        delete managedAccordions[id]
      }
    }
  }, [id, managedAccordions]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOpen = (): void => {
    if (isManaged) {
      if (manageOpen && typeof manageOpen === 'function') {
        manageOpen(id, !isOpen)
      }
    } else {
      setState((state): AccordionState => ({ ...state, isOpen: !state.isOpen }))
    }
  }

  const shiftFocus = (offset: number): void => {
    if (isManaged && typeof manageFocus === 'function') {
      manageFocus(id, offset)
    }
  }

  const focusFirstAccordion = (): void => {
    if (isManaged && typeof focusFirst === 'function') {
      focusFirst()
    }
  }

  const focusLastAccordion = (): void => {
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

const shapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 4px;
  `,
  round: css`
    border-radius: 8px;
  `,
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

const getShape = (shape: Shape): ReturnType<typeof css> => shapeMap[shape]
const getOutlineBorder = (borderSize: BorderSize): ReturnType<typeof css> =>
  outlineBorderMap[borderSize]
const getSimpleBorder = (borderSize: BorderSize): ReturnType<typeof css> =>
  simpleBorderMap[borderSize]

const accordionVariantMap: VariantMap = {
  simple: css`
  ${(p): ReturnType<typeof css> => getSimpleBorder(p.theme.border)}
    border-color: ${(p): string => p.theme.colors.lightContrast};
  `,
  outline: css`
    ${(p): ReturnType<typeof css> => getOutlineBorder(p.theme.border)}
    border-color: ${(p): string => p.theme.colors.lightContrast};
    ${(p): ReturnType<typeof css> => getShape(p.theme.shape)}
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
    border: 0px;
    ${(p): string => boxShadow(p.theme, 1)};
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
