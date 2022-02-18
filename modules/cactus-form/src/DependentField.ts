import { FieldState, FieldSubscription } from 'final-form'
import React from 'react'
import { useForm } from 'react-final-form'

import { makeConfigurableComponent } from './config'
import Field, { FieldProps } from './Field'
import { RenderFunc, UnknownProps } from './types'

type DependencyChangeHandler = (state: FieldState<unknown>, props: UnknownProps) => void

interface DependencyConfig extends FieldSubscription {
  onChange?: DependencyChangeHandler
}

interface Box {
  onChange: DependencyChangeHandler
  props: UnknownProps
}

interface DependentFieldProps extends FieldProps {
  dependsOn: string | string[] | Record<string, DependencyConfig>
  onDependencyChange?: DependencyChangeHandler
}

const DEFAULT_SUB: FieldSubscription = { value: true }
const noop = () => undefined

const DependentField: RenderFunc<DependentFieldProps> = ({
  dependsOn,
  onDependencyChange = noop,
  ...props
}) => {
  const field = Field(props)
  const box = React.useRef({} as Box).current
  box.onChange = onDependencyChange
  box.props = field?.props || {}

  const form = useForm('DependentField')
  React.useEffect(() => {
    let initialized = false
    let unsubs: (() => void)[]
    const makeHandler =
      (config: DependencyConfig = {}) =>
      (state: FieldState<unknown>) => {
        if (initialized) {
          const { onChange = box.onChange } = config
          onChange(state, box.props)
        }
      }
    if (typeof dependsOn === 'string') {
      unsubs = [form.registerField(dependsOn, makeHandler(), DEFAULT_SUB)]
    } else if (Array.isArray(dependsOn)) {
      const update = makeHandler()
      unsubs = dependsOn.map((fieldName) => form.registerField(fieldName, update, DEFAULT_SUB))
    } else {
      unsubs = Object.keys(dependsOn).map((fieldName) => {
        const config = dependsOn[fieldName]
        return form.registerField(fieldName, makeHandler(config), config)
      })
    }
    initialized = true
    return () => unsubs.forEach((unsub) => unsub())
  }, [dependsOn, box, form])
  return field
}
export default makeConfigurableComponent(DependentField, {})
