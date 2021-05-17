import React from 'react'

import styled from 'styled-components'

const Styled = styled.button`
  display: none;
`

interface SimpleProps {
  once: 'upon'
  a?: 'time'
}

interface GenericProps<T> extends SimpleProps {
  t: T
}

type PolyFC<P, D extends React.ElementType> =
  <T extends React.ElementType = D>(p: { as?: T } & PolyProps<P, T>) => React.ReactElement | null;

type PolyProps<P, T extends React.ElementType> =
  T extends keyof JSX.IntrinsicElements
  ? P & Omit<JSX.IntrinsicElements[T], 'as' | 'ref' | keyof P>
  : T extends React.ComponentType<infer U>
  ? P & Omit<U, 'as' | 'ref' | keyof P>
  : never

type PolyFCWithRef<P, D extends React.ElementType> =
  <T extends React.ElementType = D>(p: { as?: T } & PolyRefProps<P, T>) => React.ReactElement | null;

type PolyRefProps<P, T extends React.ElementType> =
  T extends keyof JSX.IntrinsicElements
  ? P & Omit<JSX.IntrinsicElements[T], 'as' | keyof P>
  : T extends React.ComponentType<infer U>
  ? P & Omit<U, 'as' | keyof P>
  : never

const polyForwardRef = <P, D extends React.ElementType>(
  func: <T extends React.ElementType = D>(
    p: { as?: T } & PolyProps<P, T>,
    ref: React.ComponentPropsWithRef<T>['ref']
  ) => React.ReactElement | null
): PolyFCWithRef<P, D> => React.forwardRef(func as any) as any

const nvr = (x: never) => undefined

class Class extends React.Component<SimpleProps> {
  render() {
    return <>{this.props.children}</>
  }
}

const Func: PolyFC<SimpleProps, 'div'> = (props) => {
  nvr(props)
  const { as: Comp = 'div', once, a, ...rest } = props
  return <Comp {...rest} />
}

const FFunc = polyForwardRef<SimpleProps, 'div'>(
  (props, ref) => {
    nvr(props)
    nvr(ref)
    const { as: Comp = 'div', once, a, ...rest } = props
    return <Comp ref={ref} {...rest} />
  }
)

const rBtn = 0 as any as React.Ref<HTMLButtonElement>
const rA = 0 as any as React.Ref<HTMLAnchorElement>
const rClass = 0 as any as React.Ref<Class>
const rDiv = 0 as any as React.Ref<HTMLDivElement>

const classes = (
  <>
    <FFunc once="upon" value="hey" />
    <FFunc as="div" once="upon" value="hey" />
    <FFunc as="input" once="upon" value="hey" />
    <FFunc as="input" once="upon" href="hey" />
    <FFunc once="upon" />
    <FFunc as="button" once="upon" ref={rBtn}/>
    <FFunc as="a" once="upon" ref={rA}/>
    <FFunc as={Class} once="upon" ref={rClass}/>
    <FFunc as="div" once="upon" ref={rDiv}/>
    <FFunc once="upon" ref={rDiv}/>
    <FFunc as="div" once="upon">{0}</FFunc>
    <FFunc as="div" once="upon" a="something" />
  </>
)
