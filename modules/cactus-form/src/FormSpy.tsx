import { FormApi, FormState, formSubscriptionItems } from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { useForm, UseFormStateParams } from 'react-final-form'

import { makeConfigurableComponent } from './config'
import { RenderFunc, RenderProps, UnknownProps } from './types'

const DEFAULT_SUBSCRIPTION: Record<string, boolean> = {}
formSubscriptionItems.forEach((sub) => {
  DEFAULT_SUBSCRIPTION[sub] = true
})

type StateProcessor = (props: UnknownProps, state: State) => UnknownProps | void
export interface FormSpyProps
  extends Omit<UseFormStateParams, 'onChange'>,
    RenderProps,
    UnknownProps {
  processState?: StateProcessor
}
type State = FormState<Record<string, any>, Partial<Record<string, any>>> & { form?: FormApi }

const FormSpy: RenderFunc<FormSpyProps> = ({
  render,
  component,
  children,
  subscription,
  processState = Object.assign,
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
    return form.subscribe(setState, sub)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  state.form = form
  const props = processState(rest, state) || rest
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

export default makeConfigurableComponent(FormSpy, {
  subscription: DEFAULT_SUBSCRIPTION,
})
