// This is in a separate file to avoid circular dependency with `Layout`.
import React from 'react'

import { useValue } from '../helpers/react'

export type OrderHintKey = 'top' | 'high' | 'center' | 'low' | 'bottom'
export type OrderHint = OrderHintKey | number

const HINT_ORDER: { [K in OrderHintKey]: number } = {
  top: 0,
  high: 25,
  center: 50,
  low: 75,
  bottom: 100,
}

interface Action {
  element: React.ReactElement
  order: number
}

type ActionMap = { [K in React.Key]: Action }

type AddAction = (k: React.Key, e: React.ReactElement, o?: OrderHint) => void
type RemoveAction = (k: React.Key) => void

interface ActionControl {
  addAction?: AddAction
  removeAction?: RemoveAction
  hasConsumer: boolean
}

type ActionCtx = [ActionMap, (cb: React.SetStateAction<ActionControl>) => void]

const ActionContext = React.createContext<ActionCtx | undefined>(undefined)
const ActionControlContext = React.createContext<ActionControl>({ hasConsumer: false })

export function useAction(
  element: React.ReactElement | null,
  orderHint?: OrderHint,
  key?: React.Key
): React.ReactElement | null {
  const { addAction, removeAction, hasConsumer } = React.useContext(ActionControlContext)
  if (element && !key && key !== 0) {
    key = element.key || element.key === 0 ? element.key : undefined
  }
  // TODO It'd be great if I could come up with some sort of hash that indicated
  // if an element needs a re-render, instead of having to re-add it every time.
  // My initial thought is that it would depend on `type`, `key`, and a shallow
  // `props` comparison, except for children where we recurse. Shouldn't need to
  // worry about re-renders triggered by hooks, since that's handled internally
  // regardless of where the element ends up in the tree.
  React.useEffect(() => {
    if (element && addAction) {
      if (key === undefined) {
        throw new Error('Cannot add action bar item without a key.')
      }
      addAction(key, element, orderHint)
    }
  }, [element, orderHint, key, addAction])
  React.useEffect(() => {
    if (key && removeAction) {
      return () => removeAction(key as React.Key)
    }
  }, [key, removeAction])
  return !hasConsumer ? element : null
}

export function useActionBarItems(): React.ReactElement[] {
  const actionCtx = React.useContext(ActionContext)
  const actions: ActionMap = actionCtx ? actionCtx[0] : {}
  const setControl = actionCtx && actionCtx[1]
  React.useEffect(() => {
    if (setControl) {
      setControl((c) => (c.hasConsumer ? c : { ...c, hasConsumer: true }))
      return () => setControl((c) => (!c.hasConsumer ? c : { ...c, hasConsumer: false }))
    }
  }, [setControl])
  const actionList = Object.keys(actions).map((k) => actions[k])
  actionList.sort((a, b) => a.order - b.order)
  return actionList.map((a) => a.element)
}

const ActionProvider: React.FC = ({ children }) => {
  const [actions, setActions] = React.useState<ActionMap>({})
  const addAction: AddAction = (key, element, orderHint) => {
    if (element.key === null) {
      element = React.cloneElement(element, { key })
    }
    setActions((existingActions) => {
      const action = { element, order: HINT_ORDER.center }
      if (existingActions[key] === undefined) {
        let $order = action.order
        if (typeof orderHint === 'number') {
          $order = orderHint
        } else if (orderHint && HINT_ORDER.hasOwnProperty(orderHint)) {
          $order = HINT_ORDER[orderHint]
        }
        // Because Javascript sort is not guaranteed stable, we want `order` to be unique.
        const orders = new Set(Object.keys(existingActions).map((k) => existingActions[k].order))
        while (orders.has($order)) {
          $order++
        }
        action.order = $order
      } else {
        action.order = existingActions[key].order
      }
      return { ...existingActions, [key]: action }
    })
  }
  const removeAction: RemoveAction = (key) =>
    setActions((existingActions) => {
      if (existingActions[key] !== undefined) {
        existingActions = { ...existingActions }
        delete existingActions[key]
      }
      return existingActions
    })
  const [control, setControl] = React.useState<ActionControl>({
    addAction,
    removeAction,
    hasConsumer: false,
  })
  const actionCtx = useValue<ActionCtx>([actions, setControl], [actions])
  return (
    <ActionControlContext.Provider value={control}>
      <ActionContext.Provider value={actionCtx}>{children}</ActionContext.Provider>
    </ActionControlContext.Provider>
  )
}
export default ActionProvider
