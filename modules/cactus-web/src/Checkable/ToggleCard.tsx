import React from 'react'

import { CheckableProps, WrapperLabel } from './Wrapper'
import { useBox } from '../helpers/react'
import generateId from '../helpers/generateId'

interface ToggleCardProps extends CheckableProps {
  type: 'checkbox' | 'radio'
  focusRef?: React.RefObject<{ focus: () => void }>
  children?: React.ReactNode
}

interface WrapperProps {
  as?: 'div'
  id: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  htmlFor?: string
}

interface ToggleBox {
  id: string
  focusRef?: React.RefObject<{ focus: () => void }>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  focusOnChecked: React.ChangeEventHandler<HTMLInputElement>
  emulateLabel: React.MouseEventHandler<HTMLElement>
}

const CLICK_ELEMENTS = 'a[href],label,input,button,select,textarea'

const initHandlers = () => {
  const box = {
    id: generateId('tcard'),
    focusOnChecked: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { onChange, focusRef } = box
      onChange?.(e)
      if (e.target.checked) {
        focusRef?.current?.focus()
      }
    },
    emulateLabel: (e: React.MouseEvent<HTMLElement>) => {
      // Automatically stop for elements with "default" onClick behavior;
      // otherwise you'd need to call `preventDefault` or `stopPropagation`.
      const input = e.currentTarget.querySelector('input')
      if (input && e.button == 0 && !e.isDefaultPrevented() && !e.target.matches(CLICK_ELEMENTS)) {
        input.focus()
        input.click()
      }
    },
  }
  return box as ToggleBox
}

const ToggleCard = React.forwardRef<HTMLInputElement, ToggleCardProps>(
  function ToggleCard(props, ref) {
    const { focusRef, children, className, ...rest } = props
    const box = useBox({ focusRef, onChange: rest.onChange }, initHandlers)
    const wrapperProps: WrapperProps = { id: box.id, className }
    if (focusRef) {
      wrapperProps['as'] = 'div'
      wrapperProps['onClick'] = box.emulateLabel
      rest.onChange = box.focusOnChecked
      if (!rest['aria-label'] && !rest['aria-labelledby']) {
        rest['aria-labelledby'] = wrapperProps.id
      }
    } else if (rest.id) {
      wrapperProps['htmlFor'] = rest.id
    }
    return (
      <WrapperLabel {...wrapperProps}>
        <input {...rest} ref={ref} />
        {children}
      </WrapperLabel>
    )
  }
)
