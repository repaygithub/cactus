import { DialogContent, DialogOverlay, DialogProps } from '@reach/dialog'
import { NavigationClose } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { height, HeightProps, maxHeight, MaxHeightProps, width, WidthProps } from 'styled-system'

import { DimmerStyled } from '../Dimmer/Dimmer'
import Flex from '../Flex/Flex'
import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { omitProps } from '../helpers/omit'
import { border, boxShadow, radius } from '../helpers/theme'
import cssVariant from '../helpers/variant'
import IconButton from '../IconButton/IconButton'

export type ModalType = 'action' | 'danger' | 'warning' | 'success'

export interface ModalProps extends WidthProps, FlexItemProps {
  className?: string
  closeLabel?: string
  isOpen: boolean
  modalLabel?: string
  onClose: () => void
  variant?: ModalType
  innerHeight?: HeightProps['height']
  innerMaxHeight?: MaxHeightProps['maxHeight']
}
interface ModalPopupProps
  extends DialogProps,
    WidthProps,
    HeightProps,
    MaxHeightProps,
    FlexItemProps {
  variant: ModalType
}

const ModalBase: FunctionComponent<ModalProps> = (props): React.ReactElement => {
  const {
    variant = 'action',
    children,
    isOpen,
    onClose,
    modalLabel,
    closeLabel,
    innerHeight,
    innerMaxHeight = '60vh',
    ...rest
  } = props
  const hasChildren = !!React.Children.count(children)

  return (
    <ModalPopUp
      aria-label={modalLabel}
      isOpen={isOpen}
      onDismiss={onClose}
      variant={variant}
      height={innerHeight}
      maxHeight={innerMaxHeight}
      as={DialogOverlay}
      {...rest}
    >
      <DialogContent aria-label={modalLabel}>
        <IconButton className="modal-close-btn" onClick={onClose} label={closeLabel}>
          <NavigationClose />
        </IconButton>
        {hasChildren && (
          <Flex
            className="modal-children"
            flexDirection="column"
            alignItems="center"
            flexWrap="nowrap"
          >
            {children}
          </Flex>
        )}
      </DialogContent>
    </ModalPopUp>
  )
}

export const ModalPopUp = styled(DimmerStyled).withConfig(
  omitProps<ModalPopupProps>('maxHeight', 'flex', 'flexBasis', 'flexGrow', 'flexShrink')
)`
  bottom: 0;
  display: flex;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  align-items: center;
  flex-direction: row;
  z-index: 101;
  > [data-reach-dialog-content] {
    ${(p) => p.width && 'box-sizing: border-box;'}
    flex-basis: ${(p) => !p.width && p.flexBasis === undefined && '100%'};
    width: ${(p) => !p.width && '100%'};
    border: ${(p) => border(p.theme, '')};
    border-radius: ${radius(20)};
    background: white;
    ${(p): string => boxShadow(p.theme, 2)};
    max-width: ${(p) => !p.width && '80%'};
    ${width}
    ${flexItem}
    outline: none;
    padding: 64px 24px 40px 24px;
    position: relative;
    .modal-children {
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      overflow: auto;
      -ms-overflow-style: -ms-autohiding-scrollbar;
      ${height}
      ${maxHeight}
      > * {
        max-width: 100%;
      }
    }
    ${cssVariant({
      action: css`
        border-color: ${(p): string => p.theme.colors.callToAction};
      `,
      warning: css`
        border-color: ${(p): string => p.theme.colors.warning};
      `,
      success: css`
        border-color: ${(p): string => p.theme.colors.success};
      `,
      danger: css`
        border-color: ${(p): string => p.theme.colors.error};
      `,
    })}
    .modal-close-btn {
      height: 16px;
      position: absolute;
      right: 24px;
      top: 24px;
      width: 16px;
      font-size: 16px;
    }
    ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
      padding: 40px 88px;
      max-width: ${(p) => !p.width && '30%'};
      .modal-close-btn {
        height: 24px;
        position: absolute;
        right: 40px;
        top: 40px;
        width: 24px;
      }
    }
  }
`
export const Modal = styled(ModalBase)``

Modal.propTypes = {
  className: PropTypes.string,
  closeLabel: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  modalLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['action', 'danger', 'warning', 'success']),
}

Modal.defaultProps = {
  closeLabel: 'Close Modal',
  isOpen: false,
  modalLabel: 'Modal',
  variant: 'action',
  innerMaxHeight: '60vh',
}
export default Modal
