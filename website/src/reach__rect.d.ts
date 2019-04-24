declare module '@reach/rect' {
  import * as React from 'react'

  type ElementRectangle = {
    x: number
    y: number
    width: number
    height: number
    top: number
    right: number
    bottom: number
    left: number
  }

  export const useRect: (
    nodeRef: React.RefObject<HTMLElement>,
    observe?: boolean
  ) => ElementRectangle | undefined

  type RectProps = {
    /** default: true */
    observe?: boolean
    onChange?: (rect: ElementRectangle) => void
    children: (state: {
      ref: React.RefObject<HTMLElement>
      rect?: ElementRectangle
    }) => React.ReactNode
  }

  const Rect: React.FC<RectProps>

  export default Rect
}
