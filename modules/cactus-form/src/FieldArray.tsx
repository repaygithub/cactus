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

const FieldArray = ({ name, component, subscription, ...rest }) => {
  const form = useForm()
  const ref = React.useRef()
  const mutators = React.useMemo(
    () =>
      Object.keys(form.mutators).reduce((result, key) => {
        result[key] = (...args) => form.mutators[key](name, ...args)
        return result
      }, {}),
    [form.mutators, name]
  )
  const trigger = React.useReducer(x => !x, false)[1]
  React.useEffect(() => {
    let keys = []
    return form.registerField(
      name,
      state => {
        ref.current = state.value
        if (state.value && getKey && setKey) {
          const newKeys = []
          const changed = state.length !== keys.length || state.value.reduce(
            (hasChanged, arrayVal, index) => {
              const key = getKey(arrayVal) ?? setKey(arrayVal)
              newKeys.push(key)
              return hasChanged || key !== keys[index]
            },
            false,
          )
          keys = newKeys
          if (changed) trigger()
        }
      },
      { ...subscription, value: true, length: true }
    )
  }, [form, name, subscription, trigger])

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
