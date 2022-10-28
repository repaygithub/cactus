import { FormState, formSubscriptionItems } from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { useForm, UseFormStateParams } from 'react-final-form'

import { RenderFunc, RenderProps, UnknownProps } from './types'

const DEFAULT_SUBSCRIPTION: Record<string, boolean> = {}
formSubscriptionItems.forEach((sub) => {
  DEFAULT_SUBSCRIPTION[sub] = true
})

interface FormSpyProps extends Omit<UseFormStateParams, 'onChange'>, RenderProps, UnknownProps {}
type State = FormState<Record<string, any>, Partial<Record<string, any>>>

const FormSpy: RenderFunc<FormSpyProps> = ({
  render,
  component,
  children,
  subscription,
  ...rest
}: FormSpyProps) => {
  const form = useForm('FormSpy')
  const sub = subscription || DEFAULT_SUBSCRIPTION
  const [state, setState] = React.useState<State>(() => {
    let initialState
    form.subscribe((s) => (initialState = s), sub)()
    return initialState as unknown as State
  })
  React.useEffect(() => {
    const unsub = form.subscribe(setState, sub)

    return () => unsub()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const props = Object.assign(rest, state, { form })
  if (typeof children === 'function') {
    return children(props)
  }
  props.children = children
  return render ? render(props) : React.createElement(component as React.ComponentType<any>, props)
}

const requireOneProp = (props: FormSpyProps, _: string, componentName: string) => {
  if (!props.component && !props.render && !props.children && !props.onChange) {
    return new Error(
      `One of props 'component', 'render', 'children' was not specified in '${componentName}.'`
    )
  }
}

;(FormSpy as any).propTypes = {
  component: requireOneProp,
  render: requireOneProp,
  children: requireOneProp,
  subscription: PropTypes.objectOf(PropTypes.bool),
}

export default FormSpy
