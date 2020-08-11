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
