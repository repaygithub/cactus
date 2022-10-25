import { FormState, formSubscriptionItems } from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSpyProps, FormSpyRenderProps, useForm, useFormState } from 'react-final-form'

const DEFAULT_SUBSCRIPTION: Record<string, boolean> = {}
formSubscriptionItems.forEach((sub) => {
  DEFAULT_SUBSCRIPTION[sub] = true
})

type State = FormState<Record<string, any>, Partial<Record<string, any>>>
type RestPropsWithChildren = Pick<FormSpyProps, 'onChange'> &
  State & {
    children?: React.ReactNode
  }

function FormSpy({ render, component, children, subscription, onChange, ...rest }: FormSpyProps) {
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

  useFormState({ onChange, subscription: sub })
  if (!!onChange) return null

  const props: FormSpyRenderProps = Object.assign(rest, state, { form })
  if (typeof children === 'function') {
    return children(props)
  }
  ;(props as RestPropsWithChildren).children = children
  return render
    ? render(props)
    : React.createElement(component as React.ComponentType<RestPropsWithChildren>, props)
}

const requireOneProp = (props: FormSpyProps, propName: string, componentName: string) => {
  if (!props.component && !props.render && !props.children && !props.onChange) {
    return new Error(
      `One of props 'component', 'render', 'children' or 'onChange' was not specified in '${componentName}.'`
    )
  }
}

;(FormSpy as any).propTypes = {
  component: requireOneProp,
  render: requireOneProp,
  children: requireOneProp,
  onChange: requireOneProp,
  subscription: PropTypes.objectOf(PropTypes.bool),
}

export default FormSpy
