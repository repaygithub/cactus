import React from 'react'
import { margin, MarginProps } from 'styled-system'

import { CheckableProps, WrapperLabel } from './Wrapper'
import { useBox } from '../helpers/react'
import { border, boxShadow, radius, textStyle } from '../helpers/theme'
import generateId from '../helpers/generateId'
import { omitProps } from '../helpers/omit'
import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { PolyFCWithRef } from '../helpers/asProps'

type Checkable = 'checkbox' | 'radio'

interface BaseCardProps extends CheckableProps, FlexItemProps {
  focusRef?: React.RefObject<{ focus: () => void }>
  children?: React.ReactNode
}
type InternalProps = BaseCardProps & { type: Checkable }
type ToggleCardProps = BaseCardProps & { ref?: React.Ref<HTMLInputElement> }

interface ToggleCardComponent extends React.FC<ToggleCardProps> {
  Group: React.FC<?>
  Inverse: PolyFCWithRef<{}, 'span'>
}

interface WrapperProps extends MarginProps {
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
      const input = e.currentTarget.querySelector('input')
      const isLeftClick = e.button == 0
      // Automatically stop for elements with "default" onClick behavior;
      // otherwise you'd need to call `preventDefault` or `stopPropagation`.
      if (input && isLeftClick && !e.isDefaultPrevented() && !e.target.matches(CLICK_ELEMENTS)) {
        input.focus()
        input.click()
      }
    },
  }
  return box as ToggleBox
}

const ToggleCard = React.forwardRef<HTMLInputElement, InternalProps>(
  function ToggleCard(props, ref) {
    const { focusRef, children, className, ...rest } = props
    const box = useBox({ focusRef, onChange: rest.onChange }, initHandlers)
    const wrapperProps: WrapperProps = { id: box.id, className }
    let Wrapper = 'label'
    // If there's another input we can't use `label` because it can't wrap
    // multiple inputs; switch to `div` and emulate label click behavior.
    if (focusRef) {
      Wrapper = 'div'
      wrapperProps['onClick'] = box.emulateLabel
      rest.onChange = box.focusOnChecked
      if (!rest['aria-label'] && !rest['aria-labelledby']) {
        rest['aria-labelledby'] = wrapperProps.id
      }
    } else if (rest.id) {
      wrapperProps['htmlFor'] = rest.id
    }
    return (
      <Wrapper {...wrapperProps}>
        <input {...rest} ref={ref} />
        <CardSpan>{children}</CardSpan>
      </Wrapper>
    )
  }
)

export const makeToggleCard = (type: Checkable): ToggleCardComponent => {
  const Card = styled(StyledCard).withConfig(
    omitProps<ToggleCardProps>(margin, flexItem)
  ).attrs({ type, as: ToggleCard })``
  if (type === 'radio') {
    Card.displayName = 'RadioCard'
    Card.Group = makeGroup('radiogroup')
  } else {
    Card.DisplayName = 'CheckBoxGroup'
    Card.Group = makeGroup('group')
  }
  Card.Inverse = Inverse
  return Card
}

const CardSpan = styled.span`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: ${(p) => p.theme.space[4]}px;
  border: ${(p) => border(p.theme, 'lightContrast')};
  border-radius: ${radius(8)};
  ${(p) => p.theme.colorStyles.standard};
  ${(p) => textStyle(p.theme, 'h4')};

  :hover {
    ${(p) => boxShadow(p.theme, 2)};
  }

  label {
    ${(p) => textStyle(p.theme, 'small')};
  }
`

const Inverse = styled.span`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: ${(p) => p.theme.space[4]}px -${(p) => p.theme.space[4]};
  padding: ${(p) => p.theme.space[2]}px ${(p) => p.theme.space[4]};
  background-color: ${(p) => p.theme.colors.lightContrast};
  :first-child {
    margin-top: -${(p) => p.theme.space[4]}px
  }
  :last-child {
    margin-bottom: -${(p) => p.theme.space[4]}px
  }
  ${(p) => textStyle(p.theme, 'small')};
`

const StyledCard = styled(WrapperLabel)`
  ${flexItem}

  input:focus + ${CardSpan} {
    border-color: ${(p) => p.theme.colors.callToAction};
  }
  input:checked + ${CardSpan} {
    ${(p) => p.theme.colorStyles.callToAction};
    border-color: ${(p) => p.theme.colors.callToAction};
    ${Inverse} {
      background-color: ${(p) => p.theme.colors.white};
    }
  }
  input:disabled + ${CardSpan} {
    ${(p) => p.theme.colorStyles.disable};
    border-color: ${(p) => p.theme.colors.lightGray};
  }
`
