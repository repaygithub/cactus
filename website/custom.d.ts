declare module '@reach/rect' {
  export type PRect = Partial<DOMRect> & {
    readonly bottom: number
    readonly height: number
    readonly left: number
    readonly right: number
    readonly top: number
    readonly width: number
  }
}
