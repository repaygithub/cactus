import { NavigationClose } from '@repay/cactus-icons'
import { border, CactusColor, colorStyle, mediaGTE, radius, space } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import {
  compose,
  FontSizeProps,
  height,
  LayoutProps,
  margin,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  padding,
  position,
  PositionProps,
  SpaceProps,
  textAlign,
  TextAlignProps,
  width,
} from 'styled-system'

import Dimmer from '../Dimmer/Dimmer'
import FocusLock from '../FocusLock/FocusLock'
import { omitProps } from '../helpers/omit'
import { usePortal } from '../helpers/portal'
import { trapScroll } from '../helpers/scroll'
import {
  flexContainerOption,
  flexItem,
  FlexItemProps,
  FlexOptionProps,
  gapWorkaround,
  pickStyles,
  Styled,
  styledProp,
  styledUnpoly,
  styledWithClass,
} from '../helpers/styled'
import IconButton from '../IconButton/IconButton'

export const modalType = ['action', 'danger', 'warning', 'success'] as const
export type ModalType = typeof modalType[number]

type SizeProps = 'height' | 'minHeight' | 'maxHeight' | 'width' | 'minWidth' | 'maxWidth'
type StyleProps = SpaceProps & FlexOptionProps & FlexItemProps & Pick<LayoutProps, SizeProps>
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

interface CloseButtonProps {
  label?: string
  iconSize?: FontSizeProps['fontSize']
  top?: PositionProps['top']
  right?: PositionProps['right']
  left?: PositionProps['left']
}

// Overflow & flex don't mix well, so we need an intermediate div for scrolling.
const ModalBase = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ children, isOpen, onClose, modalLabel, className, closeButtonProps, ...props }, ref) => {
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
      // First condition ignores click-and-drag.
      if (event.target === mouseRef.current) {
        onClose()
      }
    }

    const { onClick: propClick } = props

    const onModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      propClick?.(event)
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
            {...props}
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
  }
)
ModalBase.displayName = 'Modal'

// Because there's an intermediate container percentages don't work well, so we
// convert to widths relative to the overlay (same dimensions as the viewport).
const convertPercentToFixed = (suffix: string, ...styleFns: typeof width[]) => {
  const composed = compose(...styleFns)
  const convert = (value: any) => {
    if (value) {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          value[key] = convert(value[key])
        }
      } else if (typeof value === 'string') {
        value = value.replace(/%/g, suffix)
      }
    }
    return value
  }
  // Note that because these are wrapped in a custom parser, they can't be `compose`d further.
  const fn = (props: any) => convert(composed(props))
  Object.assign(fn, composed)
  return fn as typeof composed
}

// Even vertical margins/padding are percentages of parent's width, per CSS spec.
const widths = convertPercentToFixed('vw', width, minWidth, maxWidth, margin, padding)
const heights = convertPercentToFixed('vh', height, minHeight, maxHeight)
const modalStyles = compose(flexItem, flexContainerOption, textAlign)

const variantColors: { [K in ModalType]: CactusColor } = {
  action: 'callToAction',
  warning: 'warning',
  success: 'success',
  danger: 'error',
}

const ModalPopUp = styledWithClass('div', 'cactus-modal').withConfig(
  omitProps<ModalPopupProps>(widths, heights, modalStyles, 'variant')
)`
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
  // Because of how styled-components groups styles, we have to increase
  // the specificity in order to override the styles in the media queries.
  && {
    ${widths}
    ${heights}
    ${modalStyles}
  }
`

const buttonPosition = pickStyles(position, 'top', 'right', 'left')

const CloseButton = styledWithClass(IconButton, 'modal-close-btn').withConfig(
  omitProps<Record<string, unknown>>(buttonPosition)
)`
  right: ${space(5)};
  top: ${space(5)};

  ${mediaGTE('medium')} {
    right: ${space(7)};
    top: ${space(7)};
  }

  && {
    position: absolute;
    ${buttonPosition}
  }
` as Styled<CloseButtonProps & React.HTMLAttributes<HTMLButtonElement>>

CloseButton.displayName = 'Modal.CloseButton'
CloseButton.propTypes = { label: PropTypes.string.isRequired }

// Passing `iconSize` as a default instead of setting the styles directly,
// because it's defined in the `IconButton` component and local styles override those.
CloseButton.defaultProps = { label: 'Close Modal', iconSize: ['small', 'small', 'medium'] }

export const Modal = styledUnpoly(ModalBase)`
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
