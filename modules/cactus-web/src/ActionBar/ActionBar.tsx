import { border, shadow } from '@repay/cactus-theme'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { layout, LayoutProps, padding, PaddingProps } from 'styled-system'

import { usePositioning } from '../helpers/positionPopover'
import { useMergedRefs } from '../helpers/react'
import { withStyles } from '../helpers/styled'
import usePopup, { PopupType, PositionPopup, TogglePopup } from '../helpers/usePopup'
import { Sidebar } from '../Layout/Sidebar'
import { OrderHint, OrderHintKey, useAction, useActionBarItems } from './ActionProvider'

interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required when used within an ActionProvider */
  id?: string
  icon: React.ReactElement
  orderHint?: OrderHint
  'aria-label': string
}

type StyleProps = LayoutProps & PaddingProps
// @ts-ignore
const stylePropNames: string[] = layout.propNames.concat(padding.propNames)

type RenderFn = (t: TogglePopup, expanded: boolean) => React.ReactElement | null

interface PanelProps extends StyleProps, Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  icon: React.ReactElement
  orderHint?: OrderHint
  popupType?: PopupType
  positionPopup?: PositionPopup
  children?: React.ReactNode | RenderFn
  'aria-label': string
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

export const ActionBarPanel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ orderHint, ...props }, ref) => {
    // Functionality encapsulated in an "inner" component so `useAction`
    // won't interfere with the effect hooks inside of `usePopup`.
    const child = <Panel {...props} ref={ref} />
    return useAction(child, orderHint, props.id)
  }
)

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    { icon, popupType = 'dialog', positionPopup, children, id, onBlur, onKeyDown, ...props },
    ref
  ) => {
    const { expanded, toggle, wrapperProps, buttonProps, popupProps } = usePopup(popupType, {
      id,
      onWrapperBlur: onBlur,
      onWrapperKeyDown: onKeyDown,
    })
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const styleProps = pick(props, stylePropNames) as StyleProps
    // Mostly expecting the label props, but I'm not going to attempt a comprehensive whitelist.
    const ariaProps: React.AriaAttributes = {}
    for (const p of Object.keys(props)) {
      if (p.startsWith('aria-')) {
        // @ts-ignore
        ariaProps[p] = props[p]
      } else if (!styleProps.hasOwnProperty(p)) {
        // @ts-ignore
        wrapperProps[p] = props[p]
      }
    }

    const childNode =
      typeof children === 'function' ? (children as RenderFn)(toggle, expanded) : children
    return (
      <ActionBar.PanelWrapper {...wrapperProps} ref={ref}>
        <ActionBar.Button {...ariaProps} {...buttonProps} ref={buttonRef}>
          {icon}
        </ActionBar.Button>
        <ActionBar.PanelPopup
          {...styleProps}
          {...popupProps}
          position={positionPopup}
          anchorRef={buttonRef}
        >
          {childNode}
        </ActionBar.PanelPopup>
      </ActionBar.PanelWrapper>
    )
  }
)

interface PanelPopupProps extends StyleProps {
  position?: PositionPopup
  anchorRef?: React.RefObject<HTMLElement | string>
  children?: React.ReactNode
}
// A variation on "as props": for `usePositioning` to work, the component must support refs.
type RequireRef<P> = P extends { ref?: React.Ref<infer R> }
  ? R extends HTMLElement
    ? P
    : never
  : never
type RefProps<T extends React.ElementType> = T extends keyof JSX.IntrinsicElements
  ? PanelPopupProps & Omit<JSX.IntrinsicElements[T], 'as'>
  : T extends React.ComponentType<infer U>
  ? PanelPopupProps & RequireRef<Omit<U, 'as' | keyof PanelPopupProps>>
  : never
interface PanelPopupType {
  <T extends React.ElementType = 'div'>(p: { as?: T } & RefProps<T>): React.ReactElement | null
  defaultProps?: Partial<PanelPopupProps>
  displayName?: string
}

const positionPanel = (popup: HTMLElement): void => {
  const parent = popup.offsetParent
  if (parent) {
    const rect = parent.getBoundingClientRect()
    if (parent.matches('.cactus-fixed-bottom')) {
      popup.style.top = 'unset'
      popup.style.left = '0'
      popup.style.bottom = `${rect.height}px`
      popup.style.right = '0'
      popup.style.maxHeight = `${rect.top}px`
      popup.style.boxShadow = 'none'
      popup.style.width = 'auto'
    } else if (parent.matches('.cactus-fixed-left, .cactus-grid-left')) {
      popup.style.top = '0'
      popup.style.left = `${rect.width}px`
      popup.style.bottom = '0'
      popup.style.right = 'unset'
      popup.style.maxHeight = ''
      popup.style.boxShadow = ''
      // This indicates a `width` prop has been used to override the default width.
      popup.style.width = !popup.hasAttribute('width') ? 'max-content' : ''
    }
  }
}

const PanelPopup: PanelPopupType = React.forwardRef<HTMLElement, PanelPopupProps>(
  ({ position = positionPanel, anchorRef, ...props }, ref_) => {
    const ref = useMergedRefs(ref_)
    // @ts-ignore
    const visible = !(props['aria-hidden'] || props.hidden)
    usePositioning({ position, visible, ref, anchorRef })
    return <StyledPopup {...props} ref={ref} />
  }
) as any
PanelPopup.displayName = 'ActionBar.PanelPopup'
PanelPopup.defaultProps = { position: positionPanel }

// The box shadow is #2, but shifted to be only on the right side.
const StyledPopup = withStyles('div', { styles: [layout, padding] })<StyleProps>`
  ${(p) => p.theme.colorStyles.standard};
  box-sizing: border-box;
  position: absolute;
  z-index: 100;
  outline: none;
  ${shadow('12px 0 24px -12px', (p) => `border-right: ${border(p, 'lightContrast')}`)}

  display: block;
  &[aria-hidden='true'] {
    display: none;
  }

  height: auto;
  width: auto;
  overflow: auto;
  padding: 8px;
`

interface ActionBarType extends React.FC<React.HTMLAttributes<HTMLDivElement>> {
  Item: typeof ActionBarItem
  Panel: typeof ActionBarPanel
  Button: typeof Sidebar.Button
  PanelPopup: typeof PanelPopup
  PanelWrapper: ReturnType<typeof styled.div>
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
ActionBar.Panel = ActionBarPanel
ActionBar.Button = Sidebar.Button
ActionBar.PanelPopup = PanelPopup
ActionBar.PanelWrapper = styled.div`
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
  display: block;
  background-color: transparent;
`

export default ActionBar

ActionBarItem.propTypes = {
  icon: PropTypes.element.isRequired,
  orderHint: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf<OrderHintKey>(['top', 'high', 'center', 'low', 'bottom']),
  ]),
  'aria-label': PropTypes.string.isRequired,
}

ActionBarPanel.propTypes = {
  icon: PropTypes.element.isRequired,
  orderHint: ActionBarItem.propTypes.orderHint,
  popupType: PropTypes.oneOf<PopupType>(['menu', 'listbox', 'tree', 'grid', 'dialog']),
  positionPopup: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

ActionBarPanel.defaultProps = { popupType: 'dialog' }
