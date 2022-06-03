import { FormApi } from 'final-form'
import { Decorator, useForm } from 'react-final-form'
import { toPath } from './helpers'
import { useEffect, useRef } from 'react'

type PreSubmitHandler = (value: any) => any
type Form = FormApi & { preSubmit?: PreSubmitHandler }

const isInt = RegExp.prototype.test.bind(/^\d+$/)
const ident = (x: any) => x
const HANDLER_KEY = ' PRE$UBM1T' // Hopefully no one would ever use this in a form...
const handlerMap = new WeakMap<Form, Record<string, any>>()

export const addFormPreSubmit: Decorator = (form: Form) => {
  if (!form.preSubmit) {
    handlerMap.set(form, {})
    form.preSubmit = (values: any) => runPreSubmit(values, handlerMap.get(form))
  }
  return ident
}

const runPreSubmit = (values, handlers) => {
  if (!handlers) {
    return values
  } else if (typeof handlers === 'function') {
    return handlers(values)
  } else if (handlers[HANDLER_KEY]) {
    values = handlers[HANDLER_KEY](values)
  }
  if (Array.isArray(values)) {
    return values.map((val, i) => runPreSubmit(val, handlers[i]))
  } else if (values && typeof values === 'object') {
    const copy = {}
    for (const key of Object.keys(values)) {
      copy[key] = runPreSubmit(values[key], handlers[key])
    }
    return copy
  }
  return values
}

export const addPreSubmitHandler = (
  form: Form,
  name: string,
  handler: PreSubmitHandler,
): React.Destructor => {
  addFormPreSubmit(form)
  const path = toPath(name)
  let container = handlerMap.get(form)
  let oldHandler: PreSubmitHandler | undefined | null = null
  const handlerWrapper = (values) => handler(oldHandler ? oldHandler(values) : values)
  if (path.length) {
    const lastIndex = path.length - 1
    for (let i = 0; i < lastIndex; i++) {
      const key = path[i]
      const next = container[key]
      if (!next || typeof next === 'function') {
        container[key] = isInt(path[i + 1]) ? [] : {}
        container[key][HANDLER_KEY] = next
      }
      container = container[key]
    }
    const leaf = container[path[lastIndex]]
    if (!leaf || typeof leaf === 'function') {
      const lastKey = path[lastIndex]
      oldHandler = leaf
      container[lastKey] = handlerWrapper
      return () => {
        if (container[lastKey] === handlerWrapper) {
          container[lastKey] = oldHandler
        } else if (container[lastKey].?[HANDLER_KEY] === handlerWrapper) {
          container[lastKey][HANDLER_KEY] = oldHandler
        }
      }
    }
    container = leaf
  }
  oldHandler = container[HANDLER_KEY]
  container[HANDLER_KEY] = handlerWrapper
  return () => {
    if (container[HANDLER_KEY] === handlerWrapper) {
      container[HANDLER_KEY] = oldHandler
    }
  }
}

const usePreSubmit = (name: string, handler?: PreSubmitHandler | null): void => {
  const form = useForm('usePreSubmit') as Form
  const ref = useRef<PreSubmitHandler>(ident)
  ref.current = handler || ident
  const hasHandler = !!handler
  useEffect(() => {
    if (hasHandler) {
      const indirectHandler = (values) => ref.current(values)
      const cleanup = addPreSubmitHandler(form, name, indirectHandler)
      return () => {
        // Try to remove the handler, but if we can't find it
        // set it to `ident` so at least it won't have any side effects.
        cleanup()
        ref.current = ident
      }
    }
  }, [hasHandler, name, form])
}

export default usePreSubmit
