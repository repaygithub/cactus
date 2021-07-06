import React from 'react'

export type GenericComponent = keyof JSX.IntrinsicElements | React.ComponentType<any>

// Like `Omit`, but not typesafe on `T` so I can exclude keys that may not exist.
type Without<T, K> = Pick<T, Exclude<keyof T, K>>

type Props<C> = C extends keyof JSX.IntrinsicElements
  ? Without<React.ComponentProps<C>, 'as'>
  : C extends React.ComponentType<infer P>
  ? Without<P, 'as'>
  : never

export type AsProps<C> = { as?: C } & Props<C>

type PolyProps<P, T extends React.ElementType> = T extends keyof JSX.IntrinsicElements
  ? P & Omit<JSX.IntrinsicElements[T], 'as' | 'ref' | keyof P>
  : T extends React.ComponentType<infer U>
  ? P & Omit<U, 'as' | 'ref' | keyof P>
  : never

export interface PolyFC<P, D extends React.ElementType> {
  <T extends React.ElementType = D>(p: { as?: T } & PolyProps<P, T>): React.ReactElement | null
  propTypes?: React.WeakValidationMap<P>
  defaultProps?: Partial<P>
  displayName?: string
}

type PolyRefProps<P, T extends React.ElementType> = T extends keyof JSX.IntrinsicElements
  ? P & Omit<JSX.IntrinsicElements[T], 'as' | keyof P>
  : T extends React.ComponentType<infer U>
  ? P & Omit<U, 'as' | keyof P>
  : never

export interface PolyFCWithRef<P, D extends React.ElementType> {
  <T extends React.ElementType = D>(p: { as?: T } & PolyRefProps<P, T>): React.ReactElement | null
  propTypes?: React.WeakValidationMap<P>
  defaultProps?: Partial<P>
  displayName?: string
}

export const polyForwardRef = <P, D extends React.ElementType>(
  func: <T extends React.ElementType = D>(
    p: { as?: T } & PolyProps<P, T>,
    ref: React.ComponentPropsWithRef<T>['ref']
  ) => React.ReactElement | null
): PolyFCWithRef<P, D> => React.forwardRef(func as any) as any
