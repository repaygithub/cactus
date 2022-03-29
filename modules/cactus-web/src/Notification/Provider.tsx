import React from 'react'

import Alert, { AlertProps, Status } from '../Alert/Alert'
import Notification, { NotificationPositionProps } from './Notification'

interface NotificationArgs extends NotificationPositionProps {
  key?: string
}

export interface AlertArgs extends AlertProps, NotificationArgs {
  message: React.ReactChild
  status: Status
  canClose?: boolean
}

export interface ElementArgs extends NotificationArgs {
  element: React.ReactElement
}

const hasElement = (args: any): args is ElementArgs => !!args.element

interface SetNotification {
  (note: AlertArgs): React.Key
  (note: ElementArgs): React.Key
}

interface NotificationController {
  setNotification: SetNotification
  clearNotification: (key: React.Key) => void
}

interface Note extends Required<NotificationPositionProps> {
  element: React.ReactElement
  key: React.Key
}

interface NotificationProps extends Required<NotificationPositionProps> {
  children: React.ReactElement[]
}

const NotificationContext = React.createContext<NotificationController | null>(null)

export const useNotifications = (): NotificationController => {
  const controller = React.useContext(NotificationContext)
  if (!controller) {
    throw new Error('`useNotifications` must be used in the context of a `NotificationProvider`')
  }
  return controller
}

const noteReducer = (state: Note[], action: Note | React.Key) => {
  if (typeof action === 'object') {
    const index = state.findIndex((n) => n.key === action.key)
    if (index < 0) {
      state = [...state]
      state.push(action)
    } else {
      console.error('Notification with key `' + action.key + '` already exists')
    }
  } else {
    const index = state.findIndex((n) => n.key === action)
    if (index >= 0) {
      state = [...state]
      state.splice(index, 1)
    }
  }
  return state
}

class NotificationStore {
  private keyCounter = 0
  // The state is handled by `useReducer`, this is partially for Typescript,
  // and in case some code somehow runs this before the hook is set up.
  notes: Note[] = []
  controller: NotificationController = {
    clearNotification: this.clearNotification.bind(this),
    setNotification: this.setNotification.bind(this),
  }

  // This'll be overridden in the renderer.
  dispatch(action: Note | React.Key) {
    this.notes = noteReducer(this.notes, action)
  }

  clearNotification(key: React.Key): void {
    this.dispatch(key)
  }

  setNotification(note: AlertArgs | ElementArgs): React.Key {
    const { vertical = 'bottom', horizontal = 'right', key = this.keyCounter++, ...rest } = note
    let element: React.ReactElement
    if (hasElement(note)) {
      element = note.element
    } else {
      const { canClose = true, message, ...alertProps } = rest as AlertArgs
      if (canClose || alertProps.closeTimeout || alertProps.onClose) {
        const originalOnClose = alertProps.onClose
        alertProps.onClose = () => {
          this.dispatch(key)
          originalOnClose?.()
        }
      }
      element = React.createElement(Alert, alertProps, message)
    }
    this.dispatch({ element, key, vertical, horizontal })
    return key
  }
}

// Separate component so that changes to the notifications don't rerender the entire tree.
const NotificationRenderer = ({ store }: { store: NotificationStore }) => {
  const [notes, dispatch] = React.useReducer(noteReducer, store.notes)
  store.dispatch = dispatch
  const sorted: Record<string, NotificationProps> = {}
  for (const note of notes) {
    const positionKey = `${note.vertical}-${note.horizontal}`
    const props =
      sorted[positionKey] ||
      (sorted[positionKey] = {
        vertical: note.vertical,
        horizontal: note.horizontal,
        children: [],
      })
    props.children.push(React.cloneElement(note.element, { key: note.key }))
  }

  const notifications: React.ReactElement[] = []
  for (const key of Object.keys(sorted)) {
    notifications.push(<Notification open key={key} {...sorted[key]} />)
  }
  return notifications.length ? <>{notifications}</> : null
}

export const NotificationProvider: React.FC = ({ children }) => {
  const ref = React.useRef<NotificationStore>()
  const store = ref.current || (ref.current = new NotificationStore())
  return (
    <NotificationContext.Provider value={store.controller}>
      <NotificationRenderer store={store} />
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
