import { color } from '@repay/cactus-theme'
import { noop } from 'lodash'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'

import { isIE } from '../helpers/constants'
import { useBox, useRenderTrigger } from '../helpers/react'
import { GRID_WIDTH } from './Grid'

const GRID_HALF = GRID_WIDTH >> 1
const TIMEOUT = isIE ? 400 : 300
const GRAVITY = 0.007
const CSS_CLASS = 'slider'

export type SlideDirection = 'left' | 'right'
type Transition = SlideDirection | 'recenter'

export interface TransitionState {
  transition?: SlideDirection
  transitionKey?: string
}

type GridRenderer = (date: Date, key: React.Key) => React.ReactElement
interface SliderProps
  extends TransitionState,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  month: number
  year: number
  render: GridRenderer
  onChange: (date: Date, e: React.SyntheticEvent) => void
}

interface Position {
  x: number
  time: number
}

interface EventData {
  left: number
  right: number
  month: number
  offset?: number
  state?: RenderState
}

interface TransitionOpts {
  left?: number
  right?: number
  duration?: string
}

type RenderState = 'idle' | 'preswipe' | 'swiping' | 'animation'

class SliderState {
  public eventData?: EventData
  private positions: Position[] = []
  private timeoutId: any = null
  private transition: Transition | undefined = undefined
  private transitionKey: string | number | undefined = undefined
  private state: RenderState = 'idle'
  private left = 0
  private right = 0
  private year = 0
  private month = 0
  private origin = NaN
  private triggerRender: () => void
  private setDate: (d: Date, e: React.SyntheticEvent) => void = noop

  getGrids(render: GridRenderer) {
    const grids: React.ReactElement[] = []
    for (let i = -this.left; i < 0; i++) {
      const date = new Date(this.year, this.month + i, 1)
      grids.push(render(date, date.valueOf()))
    }
    const center = new Date(this.year, this.month, 1)
    const centerKey = this.state === 'swiping' ? center.valueOf() : 'center'
    grids.push(render(center, centerKey))
    for (let i = 1; i <= this.right; i++) {
      const date = new Date(this.year, this.month + i, 1)
      grids.push(render(date, date.valueOf()))
    }
    return grids
  }

  get offset() {
    return -GRID_WIDTH * this.left
  }

  // Makes the object behave like a React ref.
  get current(): HTMLDivElement | null {
    return this.slider
  }
  private slider: HTMLDivElement = null as any
  ref = (node: HTMLDivElement | null) => {
    if (node) this.slider = node
  }

  constructor(triggerRender: () => void) {
    this.triggerRender = triggerRender
  }

  clearTimeout() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  beginEvent(): EventData {
    if (!this.eventData) {
      return (this.eventData = {
        month: this.month,
        left: this.left,
        right: this.right,
      })
    }
    return this.eventData
  }

  endEvent(e: React.PointerEvent) {
    if (this.eventData) {
      this.eventData.state = this.state
      const { left, right, month } = this.eventData
      if (this.month !== month) {
        this.setDate(new Date(this.year, this.month, 1), e)
      } else if (this.left !== left || this.right !== right) {
        this.triggerRender()
      } else {
        if (this.eventData.offset !== undefined) {
          this.setSwipeStyles(this.eventData.offset)
        }
        delete this.eventData
      }
    }
  }

  enterSwiping(e?: React.PointerEvent) {
    this.clearTimeout()
    this.state = 'swiping'
    this.slider.addEventListener('click', preventClick, true)
    e && this.setupSwipe(e)
  }

  enterPreswipe(e: React.PointerEvent) {
    this.state = 'preswipe'
    this.timeoutId = setTimeout(() => {
      if (this.state === 'preswipe') {
        this.enterSwiping()
      }
    }, 300)
    this.setupSwipe(e)
  }

  setupSwipe(e: React.PointerEvent) {
    if (isNaN(this.origin)) this.origin = e.clientX
    this.positions = [{ x: e.clientX, time: Date.now() }]
    this.slider.setPointerCapture(e.pointerId)
    if (this.left !== 1) this.left = 1
    if (this.right !== 1) this.right = 1
  }

  exitSwipe(pointerId: number) {
    this.clearTimeout()
    this.origin = NaN
    this.positions = []
    this.slider.releasePointerCapture(pointerId)
  }

  enterIdle(fromState: string) {
    if (this.state === fromState) {
      this.state = 'idle'
      delete this.eventData
      this.slider.removeEventListener('click', preventClick, true)
      const rerender = this.left || this.right
      this.left = this.right = 0
      this.slider.style.left = ''
      this.slider.style.height = ''
      this.slider.style.transitionDuration = ''
      this.slider.className = CSS_CLASS
      if (rerender) this.triggerRender()
    }
  }

  enterAnimation(transition: Transition, keyOrOpts: string | TransitionOpts) {
    const eventData = this.beginEvent()
    eventData.state = this.state = 'animation'
    this.timeoutId = null
    this.transition = transition
    let opts: TransitionOpts
    if (transition === 'left') {
      opts = { right: 1 }
      this.transitionKey = keyOrOpts as string
    } else if (transition === 'right') {
      opts = { left: 1 }
      this.transitionKey = keyOrOpts as string
    } else {
      opts = keyOrOpts as TransitionOpts
      this.transitionKey = Math.random()
    }

    eventData.offset = this.slider.offsetLeft
    // Have to pull this value before setting the className.
    const transitionStartHeight = this.slider.clientHeight
    this.slider.className = CSS_CLASS
    this.slider.style.height = `${transitionStartHeight}px`
    this.slider.style.transitionDuration = opts.duration || ''
    if (opts.right) {
      this.right += opts.right
      eventData.offset -= opts.right * GRID_WIDTH
    }
    if (opts.left) {
      this.left += opts.left
    }
  }

  interruptAnimation(e: React.PointerEvent) {
    const currentOffset = this.slider.offsetLeft
    // `currentOffset` will always be less than or equal to zero.
    const newLeft = Math.ceil(-(currentOffset + GRID_HALF) / GRID_WIDTH)
    const transitionDeltaX = newLeft * GRID_WIDTH + currentOffset
    const deltaLeft = newLeft - this.left
    if (deltaLeft) {
      this.month += deltaLeft
      this.left = newLeft || 1
    }
    if (!this.right) this.right = 1

    this.slider.className = CSS_CLASS
    this.origin = e.clientX - transitionDeltaX
    return transitionDeltaX
  }

  layoutEffect = () => {
    if (this.eventData && this.eventData.state === this.state) {
      const { offset } = this.eventData
      if (this.state === 'animation') {
        this.slider.style.left = `${offset}px`
      } else if (offset !== undefined) {
        this.setSwipeStyles(offset)
      }
    }
    delete this.eventData
  }

  clearAnimation() {
    this.transition = this.transitionKey = undefined
  }

  getTransitionProps() {
    if (this.transitionKey) {
      return {
        key: this.transitionKey,
        classNames: this.transition,
        onEntering: () => {
          // Unlike the end offset, this can only be calculated after render.
          const transitionEndHeight = this.slider.children[this.left].clientHeight
          this.slider.style.height = `${transitionEndHeight}px`
        },
        onEntered: () => this.enterIdle('animation'),
        nodeRef: this,
        timeout: parseInt(this.slider.style.transitionDuration) || TIMEOUT,
        children: React.createElement(React.Fragment),
      }
    }
  }

  setSwipeStyles(deltaX: number) {
    const center = this.slider.children[this.left] || this.slider.children[0]
    const side = this.slider.children[deltaX > 0 ? this.left - 1 : this.left + 1] || center
    const fraction = Math.abs(deltaX) / GRID_WIDTH
    const deltaY = center.clientHeight - side.clientHeight
    const newHeight = center.clientHeight - deltaY * fraction
    this.slider.style.left = `${deltaX + this.offset}px`
    this.slider.style.height = `${newHeight}px`
  }

  onPointerDown = (e: React.PointerEvent) => {
    if (e.isPrimary && e.button === 0) {
      const eventData = this.beginEvent()
      switch (this.state) {
        case 'idle':
          this.enterPreswipe(e)
          eventData.offset = 0
          break

        case 'animation':
          eventData.offset = this.interruptAnimation(e)
          this.enterSwiping(e)
          break

        // We only track primary pointers, so this means there's multiple pointer devices.
        case 'swiping':
        case 'preswipe':
          break
      }
      this.endEvent(e)
    } else {
      this.endInteraction(e)
    }
  }

  onPointerMove = (e: React.PointerEvent) => {
    if (e.isPrimary && this.state !== 'idle') {
      const eventData = this.beginEvent()
      const deltaX = e.clientX - this.origin
      const absX = Math.abs(deltaX)
      switch (this.state) {
        case 'preswipe':
          // If it moves a bit during a click, ignore it.
          if (absX <= 3) break
          this.enterSwiping()
        // NO BREAK
        case 'swiping':
          this.positions.push({ x: e.clientX, time: Date.now() })
          if (absX > GRID_HALF) {
            const shift = deltaX < 0 ? 1 : -1
            this.month += shift
            this.origin -= shift * GRID_WIDTH
          }
          eventData.offset = deltaX
          break

        case 'animation':
          break
      }
      this.endEvent(e)
    }
  }

  endInteraction(e: React.PointerEvent) {
    this.beginEvent()
    switch (this.state) {
      case 'preswipe':
        this.exitSwipe(e.pointerId)
        this.enterIdle('preswipe')
        break
      case 'swiping':
        const now = Date.now()
        const points = this.positions
        const currentDeltaX = e.clientX - this.origin
        this.exitSwipe(e.pointerId)
        if (points.length && e.clientX === points[points.length - 1].x) {
          points[points.length - 1].time = now
        } else {
          points.push({ x: e.clientX, time: now })
        }
        const velocity = calculateResidualVelocity(points)
        const timeToZero = Math.min(1500, Math.abs(velocity / GRAVITY))
        const accel = -velocity / timeToZero
        const distance = timeToZero * (velocity + (timeToZero * accel) / 2)
        const projectedX = currentDeltaX + distance
        const absX = Math.abs(projectedX)
        const shift = Math.ceil((absX - GRID_HALF) / GRID_WIDTH) * (projectedX > 0 ? -1 : 1)
        if (shift) {
          const opts: TransitionOpts = shift < 0 ? { right: -shift } : { left: shift }
          if (timeToZero > TIMEOUT) opts.duration = `${timeToZero}ms`
          this.enterAnimation('recenter', opts)
          this.month += shift
        } else if (!currentDeltaX) {
          this.enterIdle('swiping')
        } else {
          // Here we need to trigger a render without any grid/date changes.
          this.enterAnimation('recenter', {})
          this.triggerRender()
          return
        }
        break

      case 'idle':
      case 'animation':
        break
    }
    this.endEvent(e)
  }

  onPointerUp = (e: React.PointerEvent) => {
    if (e.isPrimary && e.button === 0) {
      this.endInteraction(e)
    }
  }
}

const initState = (triggerRender: () => void) => new SliderState(triggerRender)

const calculateResidualVelocity = (points: Position[]): number => {
  let weightMultiplier = 1
  let totalWeight = 0
  let time = 0
  let weightedVelocity = 0
  // Calculate a weighted average velocity over the last half second,
  // to extrapolate residual motion (it keeps going even after you let go).
  for (let i = points.length - 1; i > 0 && time < 500; i--) {
    const deltaT = points[i].time - points[i - 1].time
    const deltaX = points[i].x - points[i - 1].x
    time += deltaT
    totalWeight += deltaT * weightMultiplier
    // Simplified: (dx * w / dt) => (dx * wm * dt / dt) => (dx * wm)
    weightedVelocity += deltaX * weightMultiplier
    weightMultiplier *= (500 - deltaT) / 500
  }
  return weightedVelocity && weightedVelocity / totalWeight
}

const preventClick = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
}

const Slider = ({
  month,
  year,
  onChange: setDate,
  render,
  transition,
  transitionKey,
}: SliderProps) => {
  const triggerRender = useRenderTrigger()
  const state: SliderState = useBox({ setDate, year, month }, initState, triggerRender)
  const tRef = React.useRef<string | undefined>()

  if (tRef.current !== transitionKey) {
    tRef.current = transitionKey
    if (transitionKey && transition) {
      state.enterAnimation(transition, transitionKey)
    } else {
      state.clearAnimation()
    }
  }

  const grids = state.getGrids(render)

  const events = isIE
    ? undefined
    : {
        onPointerDown: state.onPointerDown,
        onPointerMove: state.onPointerMove,
        onPointerUp: state.onPointerUp,
      }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useLayoutEffect(state.layoutEffect, [state.eventData])

  const transitionProps = state.getTransitionProps()
  return (
    <StyledSlider {...events} $offset={state.offset}>
      <div className={CSS_CLASS} ref={state.ref}>
        {grids}
      </div>
      {transitionProps && <CSSTransition in appear {...transitionProps} />}
    </StyledSlider>
  )
}

// Using `-enter ~ *` works better than `-exit` when you alternate directions.
const StyledSlider = styled.div<{ $offset: number }>`
  overflow: hidden;
  background-color: ${color('lightContrast')};
  touch-action: none;

  .slider {
    display: flex;
    align-items: flex-start;
    position: relative;
    left: 0;
    transition-delay: 0s;
    transition-duration: ${TIMEOUT}ms;
    transition-timing-function: ease-out;
    transition-property: none;

    &.recenter-appear-active,
    &.left-appear-active,
    &.right-appear-active {
      left: ${(p) => p.$offset}px !important;
      transition-property: left, height;
    }
  }
`
export default Slider
