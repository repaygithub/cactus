import { ARRAY_ERROR, fieldSubscriptionItems, FieldConfig } from 'final-form'
import { useForm } from 'react-final-form'
import React from 'react'

import { popAttr, getFieldConfig } from './helpers'
import { makeConfigurableComponent } from './config'

type FieldArrayConfig = FieldConfig<unknown[]>

const generateKey = (prefix: string) => Math.random().toString().replace(/^0/, prefix)

const simpleKeyFunc = (obj: any) => {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
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
  let changed = false
  if (keyFunc) {
    const prevKeys = prevState.keys as React.Key[]
    const nextKeys = []
    changed = (fieldState.value || []).reduce(
      (hasChanged, val, index) => {
        const key = keyFunc(val)
        nextKeys.push(key)
        return hasChanged || key !== prevKeys[index]
      },
      !prevKeys,
    )
    nextState.keys = changed ? nextKeys : prevKeys
  }
  for (const key of subKeys) {
    let val = fieldState[key] ?? DEFAULTS[key]
    if ((key === 'error' || key === 'submitError') && Array.isArray(val)) {
      val = val[ARRAY_ERROR]
    }
    nextState[key] = val
    changed = changed || prevState[key] !== val
  }
  return changed ? nextState : prevState
}

const processArrayError = (error: any, checkForPromise: boolean = false) => {
  if (!error || Array.isArray(error)) {
    return error
  } else if (checkForPromise && typeof error.then === 'function') {
    return error.then(processArrayError)
  } else {
    const placeholder: any = []
    placeholder[ARRAY_ERROR] = error
    return placeholder
  }
}

// TODO No way to fully automate, would always need to be called in `onSubmit`
const removeKeys = (values, formApi) => {
  const cleanupFuncs = weakMap.get(formApi) || {}
  return runCleanup(values, cleanupFuncs)
}

const simpleCleanup = (value) => {
  if (value && typeof value === 'object' && value.hasOwnProperty('key')) {
    const { key, ...copy } = value
    return copy
  }
  return value
}

const runCleanup = (values, cleanupFuncs) => {
  if (typeof cleanupFuncs === 'function') {
    return cleanupFuncs(values)
  } else if (!values || !cleanupFuncs) {
    return values
  } else if (Array.isArray(cleanupFuncs)) {
    return values.map((val, i) => runCleanup(val, cleanupFuncs[i]))
  } else {
    const copy = {}
    for (const key of Object.keys(values)) {
      copy[key] = runCleanup(values[key], cleanupFuncs[key])
    }
    return copy
  }
}

const FieldArray = ({ name, component, render, subscription, keyFunc, processMeta, validate, ...rest }) => {
  if (typeof rest.children === 'function') {
    render = popAttr(rest, 'children') as RenderFunc
  } else if (!component && !render && rest['as']) {
    component = popAttr(rest, 'as') as React.ElementType<any>
  }
  const form = useForm()

  const ref = React.useRef()
  if (ref.current?.name !== name) {
    const mutators = { change: (value?: unknown[]) => form.change(name, value) }
    for (const key of Object.keys(form.mutators)) {
      const mutator = form.mutators[key]
      mutators[key] = (...args) => mutator(name, ...args)
    }
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
    const validator = (value, formValues, meta) => {
      const error = ref.current.validate?.(value, formValues, meta)
      return processArrayError(error, true)
    }
    fieldConfig.getValidator = () => validator
    return form.registerField(name, onStateChange, sub, fieldConfig)
  }

  const [fieldState, setState] = React.useState(() => {
    let state = undefined
    register((s) => (state = s))()
    return state
  })
  React.useEffect(register, [name, form])

  const length = fieldState.length
  const arrayProps = {
    ...ref.current.mutators,
    map: (fn, thisArg) => {
      if (thisArg !== undefined) fn = fn.bind(thisArg)
      const results = []
      for (let i = 0; i < length; i++) {
        results.push(fn(`${name}[${i}]`, i))
      }
      return results
    },
    ...fieldState,
    name,
  }
  const props = processMeta(rest, arrayProps)
  if (render) {
    return render(props)
  } else if (component) {
    return React.createElement(component, props)
  }
  return null
}

export default makeConfigurableComponent(FieldArray, { keyFunc: simpleKeyFunc, processMeta: (props, meta) => Object.assign(meta, props) })
