import React from 'react'

export type UnknownProps = Record<string, unknown>

export type RenderFunc<P = UnknownProps> = (props: P) => React.ReactElement | null

// Don't like how React's version adds `children` whether they should be accepted or not.
export interface FC<P> extends RenderFunc<P> {
  propTypes?: React.WeakValidationMap<P>
  defaultProps?: Partial<P>
}

export interface RenderProps {
  component?: React.ElementType<any>
  children?: React.ReactNode | RenderFunc
  render?: RenderFunc
}

export interface ConfigurableComponent<P> extends FC<P> {
  withDefaults: (defaults: Partial<P>) => ConfigurableComponent<P>
  configureDefaults: (defaults: Partial<P>) => Partial<P>
  initialDefaults: () => Partial<P>
}
