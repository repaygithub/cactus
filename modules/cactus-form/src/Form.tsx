import { formSubscriptionItems } from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { Form as FinalForm, FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

const renderSimpleForm = <FormValues,>({
  handleSubmit,
  form,
  ...rest
}: FormRenderProps<FormValues>) => {
  // `react-final-form` adds all the state properties even if they don't have values.
  for (const key of formSubscriptionItems) {
    // @ts-ignore
    if (rest[key] === undefined) delete rest[key]
  }
  return <form onSubmit={handleSubmit} onReset={() => form.restart()} {...rest} />
}

const Form = <FormValues,>(props: FinalFormProps<FormValues>) => {
  const component = props.component || props.as || 'form'
  if (component === 'form' && !props.render) {
    props = { ...props, render: renderSimpleForm }
    delete props.component
  }
  return FinalForm(props)
}
Form.defaultProps = { subscription: {} }

const requireOneProp = (props: FinalFormProps, _: string, componentName: string) => {
  if (!props.component && !props.render && !props.children) {
    return new Error(
      `One of props 'component', 'render', or 'children' was not specified in '${componentName}.'`
    )
  }
}

Form.propTypes = {
  component: requireOneProp,
  render: requireOneProp,
  children: requireOneProp,
  onSubmit: PropTypes.func.isRequired,
  debug: PropTypes.func,
  decorators: PropTypes.arrayOf(PropTypes.func),
  form: PropTypes.object,
  initialValues: PropTypes.object,
  initialValuesEqual: PropTypes.func,
  keepDirtyOnReinitialize: PropTypes.bool,
  mutators: PropTypes.objectOf(PropTypes.func),
  validate: PropTypes.func,
  validateOnBlur: PropTypes.bool,
}

export default Form
