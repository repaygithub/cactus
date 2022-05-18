import { fieldSubscriptionItems } from 'final-form'
import { useForm } from 'react-final-form'
import generateKey from 'helpers/generateKey'
import React from 'react'

const generateKey = (prefix: string) => Math.random().toString().replace(/^0/, prefix)

const simpleKeyFunc = (obj: any) => {
  if (obj && typeof obj === 'object') {
    return obj.hasOwnProperty('key') ? obj.key : (obj.key = generateKey('array'))
  }
}

const DEFAULTS = { value: [], length: 0 }

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

const FieldArray = ({ name, component, subscription, ...rest }) => {
  const form = useForm()
  const mutators = React.useMemo(
    () =>
      Object.keys(form.mutators).reduce((result, key) => {
        result[key] = (...args) => form.mutators[key](name, ...args)
        return result
      }, {}),
    [form.mutators, name]
  )

  const register = (callback) => {
    // There's basically no reason to ever not subscribe to length.
    const sub = { ...subscription, length: true }
    const subKeys = fieldSubscriptionItems.filter((k) => sub[k])
    sub.value = sub.value || !!keyFunc
    const onStateChange = callback
      ? (state) => callback(processState(state, {}, subKeys, keyFunc))
      : (state) => setState((old) => processState(state, old, subKeys, keyFunc))
    return form.registerField(name, onStateChange, sub, {
      ...fieldConfig,
      getValidator: () => box.validate,
      silent: !!callback,
    })
  }

  const [fieldState, setState] = React.useState(() => {
    let state = undefined
    register((s) => (state = s))()
    return state
  })
  React.useEffect(register, [name, form])

  const length = fieldState.length
  mutators.map = (fn, thisArg) => {
    if (thisArg !== undefined) fn = fn.bind(thisArg)
    const results = []
    for (let i = 0; i < length; i++) {
      results.push(fn(`${name}[${i}]`, i))
    }
    return results
  }
  const props = processMeta(rest, fieldState, mutators)
  return React.createElement(component, props)
}

export default FieldArray
