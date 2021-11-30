import { FieldState, FieldSubscription } from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { useForm } from 'react-final-form'

import { FC, RenderFunc, RenderProps, UnknownProps } from './types'

interface FieldSpyProps extends UnknownProps, RenderProps {
  fieldName: string
  subscription: FieldSubscription
  isEqual?: (left: any, right: any) => boolean
}

const FieldSpy: FC<FieldSpyProps> = ({
  fieldName,
  subscription,
  component,
  render,
  isEqual,
  ...props
}) => {
  if (typeof props.children === 'function') {
    render = props.children as RenderFunc
    delete props.children
  }
  const form = useForm()
  const [state, setState] = React.useState<FieldState<unknown>>()
  React.useEffect(() => {
    const config = isEqual && { isEqual }
    return form.registerField(fieldName, setState, subscription, config)
  }, [fieldName, form, subscription, isEqual])
  if (!state) return null
  Object.assign(props, state)
  if (render) {
    return render(props)
  } else if (component) {
    return React.createElement(component, props)
  }
  return null
}
FieldSpy.propTypes = {
  fieldName: PropTypes.string.isRequired,
  subscription: PropTypes.objectOf(PropTypes.bool).isRequired,
}
export default FieldSpy
