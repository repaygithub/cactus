import { BaseSyntheticEvent, FocusEvent as ReactFocusEvent } from 'react'

import { isIE } from './constants'

export function isFocusOut(event: ReactFocusEvent<HTMLElement>): boolean {
  // IE sets activeElement before the blur/focus events, but doesn't support
  // relatedTarget. Note that in React 17 this might change if they switch
  // from focus/blur to focusin/focusout, which DO support relatedTarget.
  const focused = event.relatedTarget || (isIE ? document.activeElement : null)
  return !focused || !event.currentTarget.contains(focused as Node)
}

export interface TargetProps<T> {
  id?: string
  name?: string
  value?: T
}

export class CactusEventTarget<T> implements EventTarget {
  id?: string
  name?: string
  value: T | null

  constructor(props: TargetProps<T>) {
    this.id = props.id
    this.name = props.name
    this.value = props.value !== undefined ? props.value : null
  }

  // I considered implementing this, but it doesn't seem worth the added complexity;
  // I might rethink that if React ever makes a way to bubble custom events.
  addEventListener(): void {
    throw new Error('Not Implemented')
  }
  removeEventListener(): void {
    throw new Error('Not Implemented')
  }
  dispatchEvent(): boolean {
    throw new Error('Not Implemented')
  }
}

class BaseEvent<E, T> implements BaseSyntheticEvent<E, T, T> {
  private reactEvent: BaseSyntheticEvent<E, any, any>
  currentTarget: T
  target: T
  bubbles = false
  cancelable = false
  type: string

  constructor(type: string, target: T, originalEvent: BaseSyntheticEvent<E, any, any>) {
    this.type = type
    this.currentTarget = this.target = target
    this.reactEvent = originalEvent
  }
  get nativeEvent(): E {
    return this.reactEvent.nativeEvent
  }
  get eventPhase(): number {
    return this.reactEvent.eventPhase
  }
  get isTrusted(): boolean {
    return this.reactEvent.isTrusted
  }
  get timeStamp(): number {
    return this.reactEvent.timeStamp
  }
  get defaultPrevented(): boolean {
    return this.reactEvent.defaultPrevented
  }
  preventDefault() {
    this.reactEvent.preventDefault()
  }
  isDefaultPrevented(): boolean {
    return this.reactEvent.isDefaultPrevented()
  }
  stopPropagation() {
    return this.reactEvent.stopPropagation()
  }
  isPropagationStopped() {
    return this.reactEvent.isPropagationStopped()
  }
  persist() {
    this.reactEvent.persist()
  }
}

/** This is compatible with `React.ChangeEvent` and `React.FormEvent`. */
export class CactusChangeEvent<T> extends BaseEvent<Event, CactusEventTarget<T>> {
  constructor(target: CactusEventTarget<T>, originalEvent: BaseSyntheticEvent<Event, any, any>) {
    super('change', target, originalEvent)
  }
}

/** This is compatible with `React.FocusEvent<any>`. */
export class CactusFocusEvent<T> extends BaseEvent<FocusEvent, CactusEventTarget<T>> {
  relatedTarget: EventTarget | null

  constructor(
    type: 'focus' | 'blur',
    target: CactusEventTarget<T>,
    originalEvent: ReactFocusEvent<any>
  ) {
    super(type, target, originalEvent)
    this.relatedTarget = originalEvent.relatedTarget
  }
}
