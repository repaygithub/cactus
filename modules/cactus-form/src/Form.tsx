import { formSubscriptionItems } from 'final-form'
import React from 'react'
import { Form as FinalForm, FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

function renderSimpleForm<FormValues>({
  handleSubmit,
  form,
  ...rest
}: FormRenderProps<FormValues>) {
  // `react-final-form` adds all the state properties even if they don't have values.
  for (const key of formSubscriptionItems) {
    // @ts-ignore
    if (rest[key] === undefined) delete rest[key]
  }
  return <form onSubmit={handleSubmit} onReset={() => form.restart()} {...rest} />
}

function Form<FormValues>(props: FinalFormProps<FormValues>) {
  const component = props.component || props.as || 'form'
  if (component === 'form' && !props.render) {
    props = { ...props, render: renderSimpleForm }
    delete props.component
  }
  console.log(props.subscription)
  return FinalForm(props)
}
Form.defaultProps = { subscription: {} }

export default Form
