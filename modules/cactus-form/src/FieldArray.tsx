import { fieldSubscriptionItems } from 'final-form'
import { useForm } from 'react-final-form'
import generateKey from 'helpers/generateKey'
import React from 'react'

const getKey = obj => (obj?.key !== undefined ? obj.key : obj)

const compareKeys = (left, right) => {
  const length = left?.length || 0
  if (length !== right?.length) return false
  for (let i = 0; i < length; i++) {
    if (getKey(left[i]) !== getKey(right[i])) return false
  }
  return true
}

const DEFAULTS = { value: [], length: 0 }

const processState = (fieldState, prevState, subKeys, keyFunc) => {
  const nextState = {}
  let changed = subKeys.reduce(
    (hasChanged, key) => {
      const val = (nextState[key] = fieldState[key] || DEFAULTS[key])
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

  const register = (callback, sub, silent = false) =>
    form.registerField(name, callback, sub, {
      ...fieldConfig,
      getValidator: () => box.validate,
      silent,
    })

  const [fieldState, setState] = React.useState(() => {
    const { keys: keyFunc, ...sub } = subscription
    const subKeys = fieldSubscriptionItems.filter((k) => sub[k])
    sub.value = sub.value || !!keyFunc
    let state = undefined
    const callback = (s) => {
      state = s
    }
    register(callback, sub, true)()
    return processState(state, {}, subKeys, keyFunc)
  })
  React.useEffect(() => {
    const { keys: keyFunc, ...sub } = subscription
    const subKeys = fieldSubscriptionItems.filter((k) => sub[k])
    sub.value = sub.value || !!keyFunc
    const callback = (s) => {
      setState((prevState) => processState(s, prevState, subKeys, keyFunc))
    }
    return register(callback, sub)
  }, [name, form])

  // I wouldn't use this interface normally, but I want it to be compatible for now.
  const length = ref.current?.length || 0
  const props = {
    ...rest,
    meta: {},
    fields: {
      name,
      length,
      value: ref.current,
      map: fn => {
        const results = []
        for (let i = 0; i < length; i++) {
          results.push(fn(`${name}[${i}]`, i))
        }
        return results
      },
      ...mutators,
    },
  }
  return React.createElement(component, props)
}

export default FieldArray
