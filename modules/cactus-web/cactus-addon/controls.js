const addDefaults = (context) => {
  const { args, argTypes } = context.parameters
  const newArgs = Object.assign({}, args, context.args)
  for (const arg of Object.keys(newArgs)) {
    // This is mostly so I can define defaults as arrays to appease Typescript.
    if (Array.isArray(newArgs[arg]) && getControl(argTypes[arg]) !== false) {
      newArgs[arg] = newArgs[arg].join(', ')
    }
  }
  for (const arg of Object.keys(argTypes)) {
    // Storybook supports this, but it's deprecated for some reason;
    // put this in so we can continue to support it after Storybook removes it.
    if (argTypes[arg].defaultValue !== undefined && newArgs[arg] === undefined) {
      newArgs[arg] = argTypes[arg].defaultValue
      delete argTypes[arg].defaultValue
    }
  }
  return newArgs
}

const getControl = (argType) => {
  const control = argType && argType.control
  return typeof control === 'object' ? control.type : control
}

const trim = (str) => str.trim()
const toArray = (value) =>
  typeof value === 'string' ? value.split(',').map(trim).filter(Boolean) : value

// Fixes/works around some issues with storybook.
const fixControlArgTypes = (context) => {
  const { args, argTypes } = context.parameters
  const newTypes = {}
  for (const arg of Object.keys(argTypes)) {
    newTypes[arg] = argTypes[arg]
    const control = getControl(argTypes[arg])
    if (control === false) {
      newTypes[arg] = Object.assign({}, argTypes[arg])
      // Things are randomly visible in the controls table even if you have
      // `table: { disable: false }`; seems to be caused by reusing the same object,
      // though why that should make a difference is quite beyond me.
      newTypes[arg].table = { disable: true }
    } else if (control === 'array' || Array.isArray(args[arg])) {
      // Trying to use the array type, default is ignored/changed to `{}`.
      newTypes[arg] = Object.assign({}, argTypes[arg])
      newTypes[arg].control = { type: 'text' }
      newTypes[arg].map = toArray
    } else if (argTypes[arg].options) {
      // When a single story uses the same `options` array for multiple controls,
      // they're "consumed" by the first control and the others are disabled.
      newTypes[arg] = Object.assign({}, argTypes[arg])
      const options = (newTypes[arg].options = argTypes[arg].options.slice(0))
      // Not a bug, but for short options lists I think inline-radio looks better than radio.
      newTypes[arg].control = { type: options.length > 5 ? 'select' : 'inline-radio' }
    } else if (argTypes[arg].type?.name === 'enum') {
      // Why do they have multiple ways to specify the same information?
      newTypes[arg] = Object.assign({}, argTypes[arg])
      const options = newTypes[arg].type.value
      newTypes[arg].control = { type: options.length > 5 ? 'select' : 'inline-radio' }
    }
  }
  return newTypes
}

const mapArgs = (story, { args, argTypes }) => {
  const newArgs = {}
  // Having undefined args was somehow screwing up some of the storyshots.
  for (const key of Object.keys(args)) {
    if (args[key] !== undefined) {
      newArgs[key] = args[key]
    }
  }
  for (const key of Object.keys(argTypes)) {
    // Storybook already supports a `mapping`, but a `map` function is a lot more flexible.
    if (argTypes[key].map) {
      const value = argTypes[key].map(args[key], newArgs, key)
      if (value !== undefined) {
        newArgs[key] = value
      }
    }
  }
  return story({ args: newArgs })
}

export const argsEnhancers = [addDefaults]
export const argTypesEnhancers = [fixControlArgTypes]
export const decorators = [mapArgs]
