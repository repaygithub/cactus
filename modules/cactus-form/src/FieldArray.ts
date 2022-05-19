import { fieldSubscriptionItems, FieldConfig } from 'final-form'
import { useForm } from 'react-final-form'
import generateKey from 'helpers/generateKey'
import React from 'react'

type FieldArrayConfig = FieldConfig<unknown[]>

const generateKey = (prefix: string) => Math.random().toString().replace(/^0/, prefix)

const simpleKeyFunc = (obj: any) => {
  if (obj && typeof obj === 'object') {
    return obj.hasOwnProperty('key') ? obj.key : (obj.key = generateKey('array'))
  }
}

const DEFAULTS = { value: [], length: 0 }

const ARRAY_PROPS: (keyof FieldArrayConfig)[] = [
  'afterSubmit',
  'beforeSubmit',
  'data',
  'defaultValue',
  'initialValue',
  'isEqual',
  'validateFields',
]

const processState = (fieldState, prevState, subKeys, keyFunc) => {
  const nextState = {}
  let changed = subKeys.reduce(
    (hasChanged, key) => {
      const val = (nextState[key] = fieldState[key] ?? DEFAULTS[key])
      return hasChanged || prevState[key] !== val
    },
    false,
  )
  if (keyFunc) {
    const prevKeys = prevState.keys as React.Key[]
    const nextKeys = []
    const keysChanged = (fieldState.value || []).reduce(
      (hasChanged, val, index) => {
        const key = keyFunc(val)
        nextKeys.push(key)
        return hasChanged || key !== prevKeys[index]
      },
      !prevKeys,
    )
    nextState.keys = keysChanged ? nextKeys : prevKeys
    changed = changed || keysChanged
  }
  return changed ? nextState : prevState
}

const FieldArray = ({ name, component, render, subscription, keyFunc, validate, ...rest }) => {
  if (typeof rest.children === 'function') {
    render = popAttr(rest, 'children') as RenderFunc
  } else if (!component && !render && rest['as']) {
    component = popAttr(rest, 'as') as React.ElementType<any>
  }
  const form = useForm()

  const ref = React.useRef()
  if (ref.current?.name !== name) {
    const mutators = Object.keys(form.mutators).reduce((result, key) => {
      const mutator = form.mutators[key]
      result[key] = (...args) => mutator(name, ...args)
      return result
    }, {
      change: (value?: unknown[]) => form.change(name, value),
      focus: () => form.focus(name),
      blur: () => form.blur(name),
    }),
    ref.current = { name, mutators }
  }
  ref.current.validate = validate

  const fieldConfig = getFieldConfig<FieldArrayConfig>(ARRAY_PROPS, rest, component)
  const register = (callback) => {
    // There's basically no reason to ever not subscribe to length.
    const sub = { ...subscription, length: true }
    const subKeys = fieldSubscriptionItems.filter((k) => sub[k])
    sub.value = sub.value || !!keyFunc
    const onStateChange = callback
      ? (state) => callback(processState(state, {}, subKeys, keyFunc))
      : (state) => setState((old) => processState(state, old, subKeys, keyFunc))
    fieldConfig.silent = !!callback
    fieldConfig.getValidator = () => ref.current.validate
    return form.registerField(name, onStateChange, sub, fieldConfig)
  }

  const [fieldState, setState] = React.useState(() => {
    let state = undefined
    register((s) => (state = s))()
    return state
  })
  React.useEffect(register, [name, form])

    [form.mutators, name]
  )

  const length = fieldState.length
  const arrayProps = {
    ...fieldState,
    ...ref.current.mutators,
    map: (fn, thisArg) => {
      if (thisArg !== undefined) fn = fn.bind(thisArg)
      const results = []
      for (let i = 0; i < length; i++) {
        results.push(fn(`${name}[${i}]`, i))
      }
      return results
    },
  }
  const props = processProps(arrayProps, rest)
  if (render) {
    return render(props)
  } else if (component) {
    return React.createElement(component, props)
  }
  return null
}

export default FieldArray
