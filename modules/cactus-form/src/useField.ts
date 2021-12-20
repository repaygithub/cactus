import { FieldState, FieldSubscription, fieldSubscriptionItems } from 'final-form'
import * as React from 'react'
import {
  FieldInputProps,
  FieldMetaState,
  FieldRenderProps,
  UseFieldConfig,
  useForm,
} from 'react-final-form'

// This is basically copied from `react-final-form`, but with a few bug fixes.
// Eventually I'd like to just patch `react-final-form` instead of having the code
// copied, but since this is a library it's not as simple as just using `patch-package`.
// - FIX1: Support groups of fields, specifically checkboxes: the code that extracts
//   checkbox values assumes each box is registered separately; this change allows
//   registering the boxes as a group, with events handled using event delegation.
// - FIX2: Related to #1, remove a warning that happens when using field groups.
// - FIX3: Use `form.change/focus/blur` instead of `state.change/focus/blur`;
//   fixes an issue with `final-form-arrays` mutators where the state is modified.

const all = fieldSubscriptionItems.reduce((result, key) => {
  // @ts-ignore Inexplicably one of the keys here has type `false | undefined`.
  result[key] = true
  return result
}, {} as FieldSubscription)

const defaultFormat = (value?: unknown) => (value === undefined ? '' : value)
const defaultParse = (value?: unknown) => (value === '' ? undefined : value)

const defaultIsEqual = (a: unknown, b: unknown) => a === b

const addLazyState = (
  dest: FieldMetaState<unknown>,
  state: FieldState<unknown>,
  keys: (keyof FieldState<any>)[]
) => {
  keys.forEach((key) => {
    Object.defineProperty(dest, key, {
      get: () => state[key],
      enumerable: true,
    })
  })
}

const addLazyFieldMetaState = (dest: FieldMetaState<unknown>, state: FieldState<unknown>) =>
  addLazyState(dest, state, [
    'active',
    'data',
    'dirty',
    'dirtySinceLastSubmit',
    'error',
    'initial',
    'invalid',
    'length',
    'modified',
    'modifiedSinceLastSubmit',
    'pristine',
    'submitError',
    'submitFailed',
    'submitSucceeded',
    'submitting',
    'touched',
    'valid',
    'validating',
    'visited',
  ])

const getSelectedValues = (options: undefined | HTMLOptionsCollection) => {
  const result = []
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index]
      if (option.selected) {
        result.push(option.value)
      }
    }
  }
  return result
}

const isReactNative = false
const getValue = (event: any, currentValue: unknown, valueProp: unknown) => {
  if (!isReactNative && event.nativeEvent && event.nativeEvent.text !== undefined) {
    return event.nativeEvent.text
  }
  if (isReactNative && event.nativeEvent) {
    return event.nativeEvent.text
  }
  const detypedEvent = event
  const {
    target: { type, value, checked },
  } = detypedEvent
  switch (type) {
    case 'checkbox':
      // FIX1
      if (valueProp === undefined) {
        // `target.value` may have a default; `getAttribute` only returns what is explicitly set.
        valueProp = event.target.getAttribute?.('value') || undefined
      }
      if (valueProp !== undefined) {
        // we are maintaining an array, not just a boolean
        if (checked) {
          // add value to current array value
          return Array.isArray(currentValue) ? currentValue.concat(valueProp) : [valueProp]
        } else {
          // remove value from current array value
          if (!Array.isArray(currentValue)) {
            return currentValue
          }
          const index = currentValue.indexOf(valueProp)
          if (index < 0) {
            return currentValue
          } else {
            return currentValue.slice(0, index).concat(currentValue.slice(index + 1))
          }
        }
      } else {
        // it's just a boolean
        return !!checked
      }
    case 'select-multiple':
      return getSelectedValues(event.target.options)
    default:
      return value
  }
}

const useLatest = <T>(value: T) => {
  const ref = React.useRef<T>(value)

  React.useEffect(() => {
    ref.current = value
  })

  return ref
}

export type Config = UseFieldConfig<unknown> & { component?: React.ElementType<any> }

function useField(name: string, config: Config = {}): FieldRenderProps<unknown> {
  const {
    afterSubmit,
    allowNull,
    component,
    data,
    defaultValue,
    format = defaultFormat,
    formatOnBlur,
    initialValue,
    multiple,
    parse = defaultParse,
    subscription = all,
    type,
    validateFields,
    value: _value,
  } = config
  const form = useForm('useField')

  const configRef = useLatest(config)

  const register = (callback: (s: FieldState<unknown>) => void, silent: boolean) =>
    // avoid using `state` const in any closures created inside `register`
    // because they would refer `state` from current execution context
    // whereas actual `state` would defined in the subsequent `useField` hook
    // execution
    // (that would be caused by `setState` call performed in `register` callback)
    form.registerField(name, callback, subscription, {
      afterSubmit,
      beforeSubmit: () => {
        const {
          beforeSubmit,
          formatOnBlur: blurFormat,
          format: formatFunc = defaultFormat,
        } = configRef.current

        if (blurFormat) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { value } = form.getFieldState(name)!
          const formatted = formatFunc(value, name)

          if (formatted !== value) {
            form.change(name, formatted)
          }
        }

        // `final-form` & `react-final-form` conflict here:
        // one has `void | false`, the other has `void | boolean`.
        return (beforeSubmit && beforeSubmit()) as any
      },
      data,
      defaultValue,
      getValidator: () => configRef.current.validate,
      initialValue,
      isEqual: (a, b) => (configRef.current.isEqual || defaultIsEqual)(a, b),
      silent,
      validateFields,
    })

  const firstRender = React.useRef(true)

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FieldState<unknown>>(() => {
    let initialState: FieldState<unknown> = {} as any

    // temporarily disable destroyOnUnregister
    const destroyOnUnregister = form.destroyOnUnregister
    form.destroyOnUnregister = false

    register((currentState) => {
      initialState = currentState
    }, true)()

    // return destroyOnUnregister to its original value
    form.destroyOnUnregister = destroyOnUnregister

    return initialState
  })

  React.useEffect(
    () =>
      register((currentState) => {
        if (firstRender.current) {
          firstRender.current = false
        } else {
          setState(currentState)
        }
      }, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      data,
      defaultValue,
      // If we want to allow inline fat-arrow field-level validation functions, we
      // cannot reregister field every time validate function !==.
      // validate,
      initialValue,
      // The validateFields array is often passed as validateFields={[]}, creating
      // a !== new array every time. If it needs to be changed, a rerender/reregister
      // can be forced by changing the key prop
      // validateFields
    ]
  )

  const handlers = {
    onBlur: React.useCallback(() => {
      // FIX3
      form.blur(state.name)
      if (formatOnBlur) {
        /**
         * Here we must fetch the value directly from Final Form because we cannot
         * trust that our `state` closure has the most recent value. This is a problem
         * if-and-only-if the library consumer has called `onChange()` immediately
         * before calling `onBlur()`, but before the field has had a chance to receive
         * the value update from Final Form.
         */
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const fieldState = form.getFieldState(state.name)!
        // FIX3
        form.change(state.name, format(fieldState.value, state.name))
      }
    }, [form, state.name, format, formatOnBlur]),
    onChange: React.useCallback(
      (event) => {
        // FIX2
        //if (process.env.NODE_ENV !== 'production' && event && event.target) {
        //  const targetType = event.target.type
        //  const unknown =
        //    ~['checkbox', 'radio', 'select-multiple'].indexOf(targetType) &&
        //    !type &&
        //    component !== 'select'

        //  const fieldValue = targetType === 'select-multiple' ? state.value : _value

        //  if (unknown) {
        //    console.error(
        //      `You must pass \`type="${
        //        targetType === 'select-multiple' ? 'select' : targetType
        //      }"\` prop to your Field(${name}) component.\n` +
        //        `Without it we don't know how to unpack your \`value\` prop - ${
        //          Array.isArray(fieldValue) ? `[${fieldValue}]` : `"${fieldValue}"`
        //        }.`
        //    )
        //  }
        //}

        const value = event && event.target ? getValue(event, state.value, _value) : event
        // FIX3
        form.change(name, parse(value, name))
      },
      [_value, name, parse, form, state.value]
    ),
    onFocus: React.useCallback(() => {
      // FIX3
      form.focus(state.name)
    }, [form, state.name]),
  }

  const meta: FieldMetaState<unknown> = {}
  addLazyFieldMetaState(meta, state)
  const input: FieldInputProps<unknown> = {
    name,
    get value() {
      let value = state.value
      if (formatOnBlur) {
        if (component === 'input') {
          value = defaultFormat(value)
        }
      } else {
        value = format(value, name)
      }
      if (value === null && !allowNull) {
        value = ''
      }
      if (type === 'checkbox' || type === 'radio') {
        return _value
      } else if (component === 'select' && multiple) {
        return value || []
      }
      return value
    },
    get checked() {
      let value = state.value
      if (type === 'checkbox') {
        value = format(value, name)
        if (_value === undefined) {
          return !!value
        } else {
          return !!(Array.isArray(value) && ~value.indexOf(_value))
        }
      } else if (type === 'radio') {
        return format(value, name) === _value
      }
      return undefined
    },
    ...handlers,
  }

  if (multiple) {
    input.multiple = multiple
  }
  if (type !== undefined) {
    input.type = type
  }

  const renderProps = { input, meta } // assign to force Flow check
  return renderProps
}

export default useField
