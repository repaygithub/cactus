import { IconProps, NavigationClose } from '@repay/cactus-icons'
import { border, CactusColor, colorStyle, mediaGTE, radius, space } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import {
  margin,
  padding,
  position,
  PositionProps,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system'

import Dimmer from '../Dimmer/Dimmer'
import FocusLock from '../FocusLock/FocusLock'
import { usePortal } from '../helpers/portal'
import { trapScroll } from '../helpers/scroll'
import {
  allHeight,
  allWidth,
  flexContainerOption,
  flexItem,
  FlexItemProps,
  FlexOptionProps,
  gapWorkaround,
  pickStyles,
  SizingProps,
  styledProp,
  withStyles,
} from '../helpers/styled'
import IconButton from '../IconButton/IconButton'

export const modalType = ['action', 'danger', 'warning', 'success'] as const
export type ModalType = typeof modalType[number]

type StyleProps = SpaceProps & FlexOptionProps & FlexItemProps & SizingProps
type DivProps = React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>

interface ModalPopupProps extends StyleProps, TextAlignProps {
  variant?: ModalType
}

export interface ModalProps extends DivProps, ModalPopupProps {
  isOpen: boolean
  modalLabel?: string
  onClose: () => void
  closeButtonProps?: CloseButtonProps
}

interface CloseButtonProps extends Pick<IconProps, 'iconSize'> {
  label?: string
  top?: PositionProps['top']
  right?: PositionProps['right']
  left?: PositionProps['left']
}

// Overflow & flex don't mix well, so we need an intermediate div for scrolling.
const ModalBase = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const {
    children,
    isOpen,
    onClose,
    modalLabel,
    className,
    closeButtonProps,
    onClick,
    ...otherProps
  } = props
  const dimmerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (dimmerRef.current) {
      const modal =
        (ref as any)?.current || dimmerRef.current.querySelector<HTMLElement>('[aria-modal]')
      if (modal) modal.focus()
      return trapScroll(dimmerRef)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const mouseRef = React.useRef<EventTarget | null>(null)

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    mouseRef.current = event.target
  }

  const onDimmerClick = (event: React.MouseEvent<HTMLElement>) => {
    // if statement to ignore click-and-drag.
    if (event.target === mouseRef.current) {
      onClose()
    }
  }

  const onModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    onClick?.(event)
  }

  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }
  return usePortal(
    <Dimmer
      className={className}
      ref={dimmerRef}
      active={isOpen}
      onMouseDown={onMouseDown}
      onClick={onDimmerClick}
      onKeyDown={closeOnEscape}
    >
      <FocusLock className="flex-container">
        <ModalPopUp
          role="dialog"
          aria-modal
          aria-label={modalLabel}
          tabIndex={-1}
          onClick={onModalClick}
          {...otherProps}
          ref={ref}
        >
          <CloseButton {...closeButtonProps} onClick={onClose}>
            <NavigationClose />
          </CloseButton>
          {children}
        </ModalPopUp>
      </FocusLock>
    </Dimmer>
  )
})

const getKeys = (...styleFns: typeof margin[]) =>
  styleFns.reduce((keys, fn) => {
    fn.propNames?.forEach(keys.add, keys)
    return keys
  }, new Set<string>())

// Even vertical margins/padding are percentages of parent's width, per CSS spec.
const vwProps = getKeys(allWidth, margin, padding)
const vhProps = getKeys(allHeight)

// Because there's an intermediate container percentages don't work well, so we
// convert to widths relative to the overlay (same dimensions as the viewport).
const convertPercentToFixed = ({ style }: { style?: React.CSSProperties }) => {
  if (style) {
    const newStyle: any = {}
    for (const key in style) {
      const value = style[key as keyof React.CSSProperties]
      newStyle[key] = value
      if (typeof value === 'string') {
        if (vwProps.has(key)) {
          newStyle[key] = value.replace(/%/g, 'vw')
        } else if (vhProps.has(key)) {
          newStyle[key] = value.replace(/%/g, 'vh')
        }
      }
    }
    return { style: newStyle }
  }
}

const variantColors: { [K in ModalType]: CactusColor } = {
  action: 'callToAction',
  warning: 'warning',
  success: 'success',
  danger: 'error',
}

const ModalPopUp = withStyles('div', {
  className: 'cactus-modal',
  styles: [allWidth, margin, padding, allHeight, flexItem, flexContainerOption, textAlign],
  transitiveProps: ['variant'],
}).attrs(convertPercentToFixed)<ModalPopupProps>`
  ${colorStyle('standard')}
  position: relative;
  box-sizing: border-box;
  border: ${(p) => border(p, variantColors[p.variant as ModalType], { thin: '2px', thick: '3px' })};
  border-radius: ${radius(20)};
  outline: none;
  margin: 5vw;
  max-width: 90vw;
  padding: ${space(7)} ${space(5)};
  padding-top: 64px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  // Will have no effect unless they enable flex display.
  align-items: center;
  flex-direction: column;

  ${mediaGTE('small')} {
    margin: ${space(5)};
    max-width: 70vw;
  }

  ${mediaGTE('medium')} {
    margin: ${space(7)};
    max-width: 50vw;
    padding: ${space(7)} 88px;
  }

  ${gapWorkaround}
`

const CloseButton = withStyles(IconButton, {
  className: 'modal-close-btn',
  styles: [pickStyles(position, 'top', 'right', 'left')],
})<CloseButtonProps>`
  position: absolute;
  right: ${space(5)};
  top: ${space(5)};

  ${mediaGTE('medium')} {
    right: ${space(7)};
    top: ${space(7)};
  }
`

CloseButton.displayName = 'Modal.CloseButton'
CloseButton.propTypes = { label: PropTypes.string.isRequired }

// Passing `iconSize` as a default instead of setting the styles directly,
// because it's defined in the `IconButton` component and local styles override those.
CloseButton.defaultProps = { label: 'Close Modal', iconSize: ['small', 'small', 'medium'] }

export const Modal = withStyles('div', { as: ModalBase, displayName: 'Modal' })`
  display: block;
  overflow: auto;
  z-index: 101;

  & > .flex-container {
    box-sizing: content-box;
    min-width: 100%;
    min-height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(modalType),
  closeButtonProps: PropTypes.shape({
    label: PropTypes.string as any,
    iconSize: styledProp,
    top: styledProp,
    right: styledProp,
    left: styledProp,
  }),
}

Modal.defaultProps = {
  modalLabel: 'Modal',
  variant: 'action',
  closeButtonProps: CloseButton.defaultProps,
}
export default Modal
