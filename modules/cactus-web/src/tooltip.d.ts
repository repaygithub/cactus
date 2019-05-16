declare module '@reach/tooltip' {
  type EventFunction<EventType> = (event: EventType) => null

  interface trigger {
    'aria-describedby': string
    'data-reach-tooltip-trigger': string
    ref: React.MutableRefObject<HTMLDivElement | null>
    onMouseEnter: EventFunction<React.MouseEvent>
    onMouseMove: EventFunction<React.MouseEvent>
    onFocus: EventFunction<React.FocusEvent>
    onBlur: EventFunction<React.FocusEvent>
    onMouseLeave: EventFunction<React.MouseEvent>
    onKeyDown: EventFunction<React.KeyboardEvent>
    onMouseDown: EventFunction<React.MouseEvent>
  }

  interface tooltip {
    id: string
    triggerRect: DOMRect
    isVisible: boolean
  }

  type isVisible = boolean

  export const useTooltip: (params: object) => [trigger, tooltip, isVisible]
}
