/********************************************************
 * useOptions.ts
 ********************************************************/

const initialOptions = { extraOptions: [], altText: {} }
// TODO Should the combobox/filter stuff be part of this state, or separate?
const reduceOptions = (state, action) => {
  if (action.type === 'add-option') {
    const extraOptions = [...state.extraOptions, action.value]
    return { ...state, extraOptions }
  } else if (action.type === 'set-alt-text') {
    // TODO Can I use the `id` as the key here instead of the actual `value`?
    if (state.altText[action.key] !== action.text) {
      const altText = { ...state.altText, [action.key]: action.text }
      return { ...state, altText }
    }
  } else if (action.type === 'bulk') {
    // TODO Weed out duplicates, only update if change
    return {
      altText: { ...state.altText, ...action.altText },
      extraOptions: [...state.extraOptions, ...action.extraOptions],
    }
  }
  return state
}

const initOptionManager = (dispatch, startTransition) => {
  const manager = {
    key: null,
    optMap: new Map(),
    ...initialOptions,
    deriveOptionsFromProps: (props) => {
      // basically the existing code from `getDerivedStateFromProps`;
      // call `dispatch` if we need to add `extraOptions`
      const newOpt = {
        value,
        label,
        key: id || prevOpt.key || generateId(),
      }
      if (!hasAltText) {
        newOpt.ref = prevOpt.ref || React.createRef()
      }
      return callbacks
    },
  }
  const callbacks = {
    getFilteredOptions: () => {},
    getOption: (key) => {},
    isValidValue: (value) => manager.optMap.has(value),
    getSelectedOptions: (value) => {},
    getOptionLabel: (key) => manager.altText[key],
    addExtraOption: (value) => dispatch({ type: 'add-option', value }),
    updateLabels: () => {
      // The "default" `altText` could be a Spinner; as a non-urgent update
      // it would continue showing old values until the new ones come in.
      const altText = {}
      manager.optMap.forEach((option) => {
        if (option.ref?.current) {
          altText[option.key] = option.ref.current.textContent
        }
      })
      startTransition(() => dispatch({ type: 'bulk', altText }))
    },
  }
  return manager
}

const useOptions = (props) => {
  // TODO is `startTransition` a stable callback in React 18?
  const [isPending, startTransition] = React.useTransition()
  const [state, dispatch] = useReducer(reduceOptions, initialOptions)
  const manager = useBox(state, initOptionManager, dispatch, startTransition)
  return manager.deriveOptionsFromProps(props)
}

/********************************************************
 * useValue.ts
 ********************************************************/

const NO_SELECTION = []
const setDefault = () => {
  const valueRef = React.createRef()
  valueRef.current = NO_SELECTION
  return { valueRef }
}

const useSelectValue = (options, props) => {
  // Use mutable state to solve timing issues with `raiseChange`.
  const [{ valueRef }, setState] = useState(setDefault)
  const value = valueRef.current
  let newValue = value
  if (props.hasOwnProperty('value')) {
    // Derive valid value
  } else {
    // Check `value` for validity against `props.multiple` && `options`.
  }
  useEffect(() => {
    // Can't update in the render func, in case the render is aborted;
    // once the render is finished, though, it's safe to update
    // (assuming nothing else has changed it in the mean time).
    if (value === valueRef.current) {
      valueRef.current = newValue
    }
  })
  // TODO Does this need to be stable?
  const raiseChange = (event, option) => {
    // calculate using the ref, so multiple events between renders will update serially
    const nextValue = calculateNewValue(valueRef.current, option)
    if (valueRef.current !== nextValue) {
      // Inside an event it's safe to update the ref.
      valueRef.current = nextValue
      setState({ valueRef })
      const cactusEvent = new CactusChangeEvent(event)
      props.onChange?.(cactusEvent)
    }
  }
  return [newValue, raiseChange]
}

/********************************************************
 * SelectList
 ********************************************************/

const SelectList = ({ options, ...props }) => {
  // TODO Or would it be better to use a `MutationObserver`? Does it react to text-only updates?
  useEffect(options.updateLabels)

  const optionsList = options.getFilteredOptions()
  // TODO Can we get rid of `data-value`? Serves no purpose, especially with complex values.
  return (
    <ul {...props}>
      {optionsList.map((opt) => (
        <Option
          id={opt.key}
          ref={opt.ref}
          key={opt.key}
          role="option"
          aria-disabled={opt.disabled}
          aria-selected={opt.selected /* TODO */}
        >
          {opt.label}
        </Option>
      )}
    </ul>
  )
}

/********************************************************
 * Select
 ********************************************************/

const Select = (props) => {
  const options = useOptions(props)
  const [value, raiseChange] = useValue(props)
  const { wrapperProps, buttonProps, popupProps } = usePopup('listbox', stuff)
  return (
    <div className={props.className} {...stuff.wrapperProps}>
      <SelectTrigger selection={options.getSelectedOptions(value)} {...buttonProps} />
      <SelectList options={options} {...popupProps} />
    </div>
  )
}
Select.displayName = 'Select'

// TODO Someday I'd like to make all our basic inputs inline,
// so they display more like simple HTML inputs.
const StyledSelect = styledUnpoly(Select)`
  ...styles
`
export { StyledSelect as Select, SelectOption }
export default StyledSelect
