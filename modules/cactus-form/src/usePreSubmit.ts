/*
 * Pre-submit handlers are intended to modify values before they are submitted;
 * unfortunately `final-form` doesn't have a real "pre-submit" hook, so we add
 * the `preSubmit` method to be called at the start of the `onSubmit` handler:
 *
 * const onSubmit = (values, api) => {
 *   values = api.preSubmit(values)
 *   return doSomething(values)
 * }
 *
 * This creates a deep copy, so if submit fails the rendered form is unchanged.
 */
import { FormApi } from 'final-form'
import { Decorator, useForm } from 'react-final-form'
import { toPath } from './helpers'
import { useEffect, useRef } from 'react'

type PreSubmitHandler = (value: any) => any
type Form = FormApi & { preSubmit?: PreSubmitHandler }

const ident = (x: any) => x
const reduceHandlers = (val, handler) => handler(val)
const HANDLER_KEY = ' PRE$UBM1T' // Hopefully no one would ever use this in a form...
const handlerMap = new WeakMap<Form, Record<string, any>>()

/*
 * Adds the `preSubmit` method to the form API object.
 *
 * Doesn't really need to be called explicitly nor passed to `decorators`,
 * since `addPreSubmitHandler` and `usePreSubmit` both ensure this is called.
 */
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
  } else if (handlers[HANDLER_KEY]) {
    values = handlers[HANDLER_KEY].reduce(reduceHandlers, values)
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

/*
 * Adds a pre-submit handler to the given form for the named field.
 *
 * Returns an unsubscriber function.
 */
export const addPreSubmitHandler = (
  form: Form,
  name: string,
  handler: PreSubmitHandler,
): React.Destructor => {
  addFormPreSubmit(form)
  const path = toPath(name)
  let container = handlerMap.get(form)
  for (const key of path) {
    container = container[key] || (container[key] = {})
  }
  const handlers = container[HANDLER_KEY] || (container[HANDLER_KEY] = [])
  const handlerIndex = handlers.length
  handlers.push(handler)
  return () => {
    handlers[handlerIndex] = ident
    for (let i = handlers.length - 1; i >= 0; i--) {
      if (handlers[i] !== ident) {
        handlers.splice(i + 1)
        break
      }
    }
  }
}

/*
 * Adds a pre-submit handler for the named field to the current form.
 *
 * Automatically removes the handler when the component is unmounted;
 * be careful if async form submission (or anything else) hides part of
 * the form, because handlers for unrendered fields will not be called.
 */
const usePreSubmit = (name: string, handler?: PreSubmitHandler | null): void => {
  const form = useForm('usePreSubmit') as Form
  const ref = useRef<PreSubmitHandler>(ident)
  ref.current = handler || ident
  const hasHandler = !!handler
  useEffect(() => {
    if (hasHandler) {
      const indirectHandler = (values) => ref.current(values)
      return addPreSubmitHandler(form, name, indirectHandler)
    }
  }, [hasHandler, name, form])
}

export default usePreSubmit
