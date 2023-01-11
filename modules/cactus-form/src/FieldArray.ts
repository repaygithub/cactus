import { useRefState } from '@repay/cactus-web'
import {
  ARRAY_ERROR,
  FieldConfig,
  FieldState,
  FieldSubscription,
  fieldSubscriptionItems,
  FieldValidator,
  IsEqual,
} from 'final-form'
import PropTypes from 'prop-types'
import React from 'react'
import { useForm } from 'react-final-form'

import { makeConfigurableComponent } from './config'
import { FC, RenderProps, UnknownProps } from './types'

type Validator = FieldValidator<unknown[]>
type State = Omit<FieldState<unknown[]>, 'blur' | 'change' | 'focus'>
type Config = Omit<FieldConfig<unknown[]>, 'getValidator' | 'silent'>
type StateProcessor = (props: UnknownProps, state: State, ops: Operators) => UnknownProps | void

type Mutators = { [K in typeof ARRAY_MUTATORS[number]]?: (...a: any[]) => any }
interface Operators extends Mutators {
  change: (value: unknown[]) => void
}

type KeyFunc = (obj: unknown) => unknown

interface FieldArrayProps extends UnknownProps, RenderProps, Config {
  name: string
  subscription?: FieldSubscription
  validate?: Validator
  getKey?: KeyFunc
  setKey?: null | ((obj: unknown) => void)
  processState?: StateProcessor
  as?: RenderProps['component']
}

// These are the mutators from `final-form-arrays`. We don't want to make
// it required, so instead we just use the list and add them if they exist.
const ARRAY_MUTATORS = [
  'insert',
  'concat',
  'move',
  'pop',
  'push',
  'remove',
  'removeBatch',
  'shift',
  'swap',
  'unshift',
  'update',
] as const

const DEFAULT_SUBSCRIPTION: FieldSubscription = {
  value: true,
  length: true,
}

let $counter = 0

const setId = (obj: any) => {
  if (obj && typeof obj === 'object') {
    if (obj.id === undefined) {
      obj.id = $counter++
    }
  }
}

const getId: KeyFunc = (obj: any) => (obj && typeof obj === 'object' ? obj.id : obj)

const makeComparator =
  (getKey: KeyFunc): IsEqual =>
  (left, right) => {
    if (left === right) {
      return true
    } else if (Array.isArray(left) && Array.isArray(right)) {
      const length = left.length
      if (length !== right.length) return false
      for (let i = 0; i < length; i++) {
        if (getKey(left[i]) !== getKey(right[i])) return false
      }
      return true
    }
    return false
  }

const convertArrayError = (error: any) => {
  if (error && !Array.isArray(error)) {
    const errorArray: any = []
    errorArray[ARRAY_ERROR] = error
    return errorArray
  }
  return error
}

const makeArrayValidator =
  (ref: React.MutableRefObject<Validator | undefined>) => (): Validator | undefined => {
    const validator = ref.current
    if (validator) {
      return (...args) => {
        const error = validator(...args)
        if (error && typeof error.then === 'function') {
          return error.then(convertArrayError)
        }
        return convertArrayError(error)
      }
    }
  }

// "changed" will always be true if `prevState` is undefined,
// so references to `prevState` on the false path are safe.
const extractState = (
  state: State,
  subscription: FieldSubscription,
  comparator: IsEqual,
  prevState?: State
): [boolean, State] => {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const result: State = { name: state.name }
  const changed = (fieldSubscriptionItems as (keyof FieldSubscription)[]).reduce(
    (isChanged, key) => {
      if (!subscription[key]) return isChanged

      const subItem = (result[key] = state[key])
      if (key === 'value') {
        if (!subItem) result[key] = []
        if (!isChanged) {
          return !comparator(prevState!.value, subItem)
        }
      } else if (key === 'error' || key === 'submitError') {
        if (subItem && subItem[ARRAY_ERROR]) {
          result[key] = subItem[ARRAY_ERROR]
        } else if (Array.isArray(subItem)) {
          // Don't return nested errors.
          result[key] = undefined
        }
      }
      return isChanged || result[key] !== prevState![key]
    },
    !prevState
  )
  return [changed, result]
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

const FieldArray: FC<FieldArrayProps> = (props) => {
  const form = useForm('FieldArray')
  const {
    name,
    initialValue,
    defaultValue,
    subscription = DEFAULT_SUBSCRIPTION,
    validate,
    validateFields,
    getKey = getId,
    setKey,
    isEqual,
    data,
    afterSubmit,
    beforeSubmit,
    render,
    as = React.Fragment,
    component = as,
    children,
    processState = Object.assign,
    ...rest
  } = props

  const validatorRef = React.useRef(validate)
  React.useEffect(() => {
    validatorRef.current = validate
  })

  const stateRef = useRefState<State>(() => {
    let initialState: State = null as any
    const comparator = isEqual || makeComparator(getKey)
    const initialize = (s: State) => {
      // If we're using keys, make sure the value has a key on every item.
      if (s.value && !isEqual && setKey) {
        s.value.forEach(setKey)
      }
      initialState = extractState(s, subscription, comparator)[1]
    }
    form.registerField(name, initialize, subscription, {
      silent: true,
      data,
      initialValue,
      defaultValue,
      isEqual: comparator,
      getValidator: makeArrayValidator(validatorRef),
      validateFields,
    })()
    return initialState
  })

  React.useEffect(() => {
    const comparator = isEqual || makeComparator(getKey)
    const fieldConfig = {
      data,
      isEqual: comparator,
      getValidator: makeArrayValidator(validatorRef),
      validateFields,
      afterSubmit,
      beforeSubmit,
    }
    const subscriber = (s: State) => {
      if (s.value && !isEqual && setKey) {
        s.value.forEach(setKey)
      }
      const [changed, nextState] = extractState(s, subscription, comparator, stateRef.current)
      // We update the current state either way, but only re-render if something's changed;
      // this is so we have the latest value in case a parent component re-renders.
      if (changed) stateRef.setState(nextState)
      else stateRef.current = nextState
    }
    return form.registerField(name, subscriber, subscription, fieldConfig)
  }, [name, data]) // eslint-disable-line react-hooks/exhaustive-deps

  const { mutators, change } = form
  const operators = React.useMemo(() => {
    const boundMutators: Operators = { change: (newVal) => change(name, newVal) }
    for (const key of ARRAY_MUTATORS) {
      const mutator = mutators[key]
      if (mutator) {
        boundMutators[key] = (...args) => mutator(name, ...args)
      }
    }
    return boundMutators
  }, [name, mutators, change])

  const fieldProps = processState(rest, stateRef.current, operators) || rest
  if (typeof children === 'function') {
    return children(fieldProps)
  } else if (render) {
    if (children) fieldProps.children = children
    return render(fieldProps)
  } else if (component) {
    return React.createElement(component, fieldProps, children)
  }
  return null
}

FieldArray.propTypes = {
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.array,
  defaultValue: PropTypes.array,
  subscription: PropTypes.shape(
    fieldSubscriptionItems.reduce((pt: any, key) => {
      pt[key] = PropTypes.bool
      return pt
    }, {})
  ),
  validate: PropTypes.func,
  validateFields: PropTypes.arrayOf(PropTypes.string.isRequired),
  setKey: PropTypes.func,
  getKey: PropTypes.func,
  isEqual: PropTypes.func,
  afterSubmit: PropTypes.func,
  beforeSubmit: PropTypes.func,
  render: PropTypes.func,
  component: PropTypes.elementType as any,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  processState: PropTypes.func,
}

export default makeConfigurableComponent(FieldArray, {
  subscription: DEFAULT_SUBSCRIPTION,
  processState: Object.assign,
  getKey: getId,
  setKey: setId,
})
