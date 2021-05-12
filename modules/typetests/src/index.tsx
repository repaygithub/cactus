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

type PolyProps<T extends keyof JSX.IntrinsicElements> = SimpleProps & { t: T } & React.ComponentPropsWithRef<T>

const nvr = (x: never) => undefined

class Class extends React.Component<SimpleProps> {
  render() {
    return <>{this.props.children}</>
  }
}

function Func<T extends keyof JSX.IntrinsicElements>(props: PolyProps<T>) {
  nvr(props)
  return <>{props.children}</>
}

const rBtn = 0 as any as React.Ref<HTMLButtonElement>
const rA = 0 as any as React.Ref<HTMLAnchorElement>
const rClass = 0 as any as React.Ref<Class>
const rDiv = 0 as any as React.Ref<HTMLDivElement>

const classes = (
  <>
    <Func t="div" id="upon" />
    <Func t="div" once="upon" />
    <Func t="div" once="upon" ref={rBtn}/>
    <Func t="div" once="upon" ref={rA}/>
    <Func t="div" once="upon" ref={rClass}/>
    <Func t="div" once="upon" ref={rDiv}/>
    <Func t="span" once="upon" ref={rDiv}/>
    <Func t="div" once="upon">{0}</Func>
    <Func t="div" once="upon" a="something" />
  </>
)
