import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { layout, LayoutProps as LayoutStyleProps, padding, PaddingProps } from 'styled-system'

import { AsProps, GenericComponent } from '../helpers/asProps'
import { border, boxShadow } from '../helpers/theme'
import usePopup, { PopupType, PositionPopup, TogglePopup } from '../helpers/usePopup'
import { LayoutProps, useLayoutProps } from '../Layout/Layout'
import { Sidebar } from '../Layout/Sidebar'
import { OrderHint, OrderHintKey, useAction, useActionBarItems } from './ActionProvider'

interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required when used within an ActionProvider */
  id?: string
  icon: React.ReactElement
  orderHint?: OrderHint
}

type StyleProps = LayoutStyleProps & PaddingProps
// @ts-ignore
const stylePropNames: string[] = layout.propNames.concat(padding.propNames)

type RenderFn = (t: TogglePopup, expanded: boolean) => React.ReactElement | null

interface PanelProps extends StyleProps, React.HTMLAttributes<HTMLElement> {
  icon: React.ReactElement
  orderHint?: OrderHint
  popupType?: PopupType
  positionPopup?: PositionPopup
  children?: React.ReactNode | RenderFn
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
      positionPopup,
      onWrapperBlur: onBlur,
      onWrapperKeyDown: onKeyDown,
    })

    const render = typeof children === 'function' ? (children as RenderFn) : null
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

    return (
      <ActionBar.PanelWrapper {...wrapperProps} ref={ref}>
        <ActionBar.Button {...ariaProps} {...buttonProps}>
          {icon}
        </ActionBar.Button>
        <ActionBar.PanelPopup {...styleProps} {...popupProps}>
          {render ? render(toggle, expanded) : children}
        </ActionBar.PanelPopup>
      </ActionBar.PanelWrapper>
    )
  }
)

// We'll add forwardRef down below, but the generic is what we want Typescript to see.
function PanelPopup<E, C extends GenericComponent = 'div'>(
  props: AsProps<C> & StyleProps,
  ref: React.Ref<E>
) {
  const layoutProps = useLayoutProps()
  return <StyledPopup {...layoutProps} {...(props as any)} ref={ref as any} />
}

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
ActionBar.PanelPopup = React.forwardRef(PanelPopup) as any
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
}

ActionBarPanel.propTypes = {
  icon: PropTypes.element.isRequired,
  orderHint: ActionBarItem.propTypes.orderHint,
  popupType: PropTypes.oneOf<PopupType>(['menu', 'listbox', 'tree', 'grid', 'dialog']),
  positionPopup: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

ActionBarPanel.defaultProps = { popupType: 'dialog' }

const styleOnlyProps = stylePropNames.concat(['fixedLeft', 'floatLeft', 'fixedBottom', 'flow'])
// The box shadow is #2, but shifted to be only on the right side.
const StyledPopup = styled.div.withConfig({
  shouldForwardProp: (prop) => !styleOnlyProps.includes(prop),
})<LayoutProps & StyleProps>`
  ${(p) => p.theme.colorStyles.standard};
  box-sizing: border-box;
  z-index: 100;
  outline: none;

  display: block;
  &[aria-hidden='true'] {
    display: none;
  }

  height: auto;
  width: auto;
  overflow: auto;
  ${layout}

  padding: 8px;
  ${padding}

  .cactus-layout-fixedBottom & {
    position: fixed;
    left: 0;
    width: 100vw;
    top: unset;
    bottom: ${(p) => p.fixedBottom}px;
    max-height: calc(100vh - ${(p) => p.fixedBottom}px);
  }

  .cactus-layout-fixedLeft & {
    position: fixed;
    left: ${(p) => p.fixedLeft}px;
    top: 0;
    bottom: ${(p) => p.fixedBottom}px;
    ${(p) =>
      boxShadow(p.theme, '12px 0 24px -12px') ||
      `border-right: ${border(p.theme, 'lightContrast')}`};
  }

  .cactus-layout-floatLeft & {
    position: absolute;
    left: ${(p) => p.floatLeft}px;
    top: 0;
    bottom: 0;
    ${(p) =>
      boxShadow(p.theme, '12px 0 24px -12px') ||
      `border-right: ${border(p.theme, 'lightContrast')}`};
  }
`
