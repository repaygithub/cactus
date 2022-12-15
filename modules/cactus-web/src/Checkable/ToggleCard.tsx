import { border, radius, shadow, textStyle } from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'
import { margin } from 'styled-system'

import { PolyFCWithRef } from '../helpers/asProps'
import { isIE } from '../helpers/constants'
import generateId from '../helpers/generateId'
import { useBox } from '../helpers/react'
import { flexItem, FlexItemProps, withStyles } from '../helpers/styled'
import { FlexGroup, GroupProps, makeGroup } from './Group'
import { CheckableProps, WrapperLabel } from './Wrapper'

type Checkable = 'checkbox' | 'radio'

interface BaseCardProps extends CheckableProps, FlexItemProps {
  focusRef?: React.RefObject<{ focus: () => void }>
  children?: React.ReactNode
}
type InternalProps = BaseCardProps & { type: Checkable }
type ToggleCardProps = BaseCardProps & { ref?: React.Ref<HTMLInputElement> }

export interface ToggleCardComponent extends React.FC<ToggleCardProps> {
  Group: React.FC<GroupProps>
  Inverse: PolyFCWithRef<{}, 'span'> // eslint-disable-line @typescript-eslint/ban-types
}

interface ToggleBox {
  id: string
  focusRef?: React.RefObject<{ focus: () => void }>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  focusOnChecked: React.ChangeEventHandler<HTMLInputElement>
  emulateLabel: React.MouseEventHandler<HTMLElement>
}

const CLICK_ELEMENTS = 'a[href],input,button,select,textarea'

const initHandlers = () => {
  let timeoutId: any = 0

  const box: ToggleBox = {
    id: generateId('toggle-card'),
    focusOnChecked: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { onChange, focusRef } = box
      onChange?.(e)
      if (e.target.checked) {
        focusRef?.current?.focus()
      }
    },
    emulateLabel: (e: React.MouseEvent<HTMLElement>) => {
      const input = e.currentTarget.querySelector('input')
      const target = e.target as HTMLElement
      const isLeftClick = e.button == 0
      // Automatically stop for elements with "default" onClick behavior;
      // otherwise you'd need to call `preventDefault` or `stopPropagation`.
      if (input && input !== target && isLeftClick && !e.isDefaultPrevented()) {
        if (!timeoutId && !(input.checked && target.matches(CLICK_ELEMENTS))) {
          input.focus()
          input.click()
          // Disable further interaction until `<label>` click behavior is passed.
          timeoutId = setTimeout(() => {
            timeoutId = 0
          })
        }
      }
    },
  }
  return box
}

const ToggleCard = React.forwardRef<HTMLInputElement, InternalProps>(function ToggleCard(
  props,
  ref
) {
  const { focusRef, children, className, style, ...rest } = props
  const box = useBox({ focusRef, onChange: rest.onChange }, initHandlers)
  if (focusRef) {
    rest.onChange = box.focusOnChecked
  }
  if (!rest['aria-label'] && !rest['aria-labelledby']) {
    rest['aria-labelledby'] = box.id
  }
  return (
    <div id={box.id} className={className} style={style} onClick={box.emulateLabel}>
      <input {...rest} ref={ref} />
      <CardSpan>{children}</CardSpan>
    </div>
  )
})

export default ToggleCard

type MakeToggleCard = (args: {
  type: Checkable
  displayName: string
  groupRole?: string
}) => ToggleCardComponent

export const makeToggleCard: MakeToggleCard = ({ type, displayName, groupRole }) => {
  const Card: ToggleCardComponent = withStyles(StyledCard, {
    displayName,
    as: ToggleCard,
    styles: [margin, flexItem],
    extraAttrs: { type },
  })`
    ${FlexGroup} .field-input-group > & {
      flex: 1 0 ${isIE ? 'auto' : '1px'};
    }
  ` as any
  Card.Group = makeGroup({
    component: FlexGroup,
    displayName: `${displayName}.Group`,
    role: groupRole,
  })
  Card.Inverse = Inverse
  return Card
}

const CardSpan = withStyles('span', { className: 'toggle-card-contents' })`
  overflow: hidden;
  overflow-wrap: break-word;
  word-wrap: break-word;
  display: block;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: ${(p) => p.theme.space[4]}px;
  border: ${border('lightContrast')};
  border-radius: ${radius(8)};
  ${(p) => p.theme.colorStyles.standard};
  ${textStyle('h4')};

  label {
    ${textStyle('small')};
  }
`

const Inverse = withStyles('span', { className: 'toggle-card-inverse' })`
  display: block;
  box-sizing: content-box;
  width: 100%;
  margin: ${(p) => p.theme.space[4]}px -${(p) => p.theme.space[4]}px;
  padding: ${(p) => p.theme.space[2]}px ${(p) => p.theme.space[4]}px;
  background-color: ${(p) => p.theme.colors.lightContrast};
  :first-child {
    margin-top: -${(p) => p.theme.space[4]}px;
  }
  :last-child {
    margin-bottom: -${(p) => p.theme.space[4]}px;
  }
  ${textStyle('small')};
`

const StyledCard = styled(WrapperLabel)`
  max-width: 100%;

  input:focus + ${CardSpan} {
    border-color: ${(p) => p.theme.colors.callToAction};
  }
  input:checked + ${CardSpan} {
    ${(p) => p.theme.colorStyles.callToAction};
    border-color: ${(p) => p.theme.colors.callToAction};
    label {
      color: ${(p) => p.theme.colorStyles.callToAction.color};
    }
    ${Inverse} {
      ${(p) => p.theme.colorStyles.standard};
    }
  }
  input:not(:disabled) + ${CardSpan}:hover {
    ${shadow(2)};
  }
  input:disabled + ${CardSpan} {
    cursor: not-allowed;
    ${(p) => p.theme.colorStyles.disable};
    border-color: ${(p) => p.theme.colors.lightGray};
    ${Inverse} {
      color: ${(p) => p.theme.colors.mediumGray};
      background-color: ${(p) => p.theme.colors.white};
    }
  }
`
