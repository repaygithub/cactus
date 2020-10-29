import { action, HandlerFunction } from '@storybook/addon-actions'

// Workaround for https://github.com/storybookjs/storybook/issues/6471
const setUpActionsWorkaround = (...names: string[]): { [K in string[number]]: HandlerFunction } =>
  names.reduce((modifiedActions, actionName) => {
    const beacon = action(actionName)
    const modifiedActionFn = (eventObj: Record<string, unknown>, ...args: unknown[]) => {
      beacon({ ...eventObj, view: undefined }, ...args)
    }
    return {
      ...modifiedActions,
      [actionName]: modifiedActionFn,
    }
  }, {})

export default setUpActionsWorkaround
