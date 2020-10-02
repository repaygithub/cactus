import PropTypes from 'prop-types'
import React from 'react'

import { Sidebar } from '../Layout/Sidebar'
import { OrderHint, OrderHintKey, useAction, useActionBarItems } from './ActionProvider'

interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required when used within an ActionProvider */
  id?: string
  icon: React.ReactElement
  orderHint?: OrderHint
}

export const ActionBarItem = React.forwardRef<HTMLButtonElement, ItemProps>(
  ({ icon, orderHint, ...props }, ref) => {
    const child = (
      <ActionBar.Button {...props} ref={ref}>
        {icon}
      </ActionBar.Button>
    )
    return useAction(child, orderHint, props.id)
  }
)

ActionBarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  orderHint: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf<OrderHintKey>(['top', 'high', 'center', 'low', 'bottom']),
  ]),
}

interface ActionBarType extends React.FC<React.HTMLAttributes<HTMLDivElement>> {
  Item: typeof ActionBarItem
  Button: typeof Sidebar.Button
}

export const ActionBar: ActionBarType = ({ children, ...props }) => {
  const actionBarItems = useActionBarItems()
  return (
    <Sidebar {...props} layoutRole="actionbar">
      {actionBarItems}
      {children}
    </Sidebar>
  )
}

ActionBar.Item = ActionBarItem
ActionBar.Button = Sidebar.Button
export default ActionBar
