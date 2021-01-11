import { DialogContent, DialogOverlay, DialogProps } from '@reach/dialog'
import { NavigationClose } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { height, HeightProps, maxHeight, MaxHeightProps, width, WidthProps } from 'styled-system'

import Flex from '../Flex/Flex'
import { border, boxShadow } from '../helpers/theme'
import variant from '../helpers/variant'
import IconButton from '../IconButton/IconButton'

export type ModalType = 'action' | 'danger' | 'warning' | 'success'

export interface ModalProps extends WidthProps, HeightProps, MaxHeightProps {
  className?: string
  closeLabel?: string
  isOpen: boolean
  modalLabel?: string
  onClose: () => void
  variant?: ModalType
}
interface ModalPopupProps extends DialogProps, WidthProps {
  variant: ModalType
}

const shapeMap = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px;',
  round: 'border-radius: 20px;',
}

const Modalbase: FunctionComponent<ModalProps> = (props): React.ReactElement => {
  const { variant = 'action', children, isOpen, onClose, modalLabel, closeLabel, ...rest } = props
  const hasChildren = !!React.Children.count(children)

  return (
    <ModalPopUp
      aria-label={modalLabel}
      isOpen={isOpen}
      onDismiss={onClose}
      variant={variant}
      {...rest}
    >
      <DialogContent aria-label={modalLabel}>
        <IconButton onClick={onClose} label={closeLabel}>
          <NavigationClose />
        </IconButton>
        {hasChildren && (
          <Flex className="modal-children" flexDirection="column" alignItems="center">
            {children}
          </Flex>
        )}
      </DialogContent>
    </ModalPopUp>
  )
}

export const ModalPopUp = styled(DialogOverlay)<ModalPopupProps>`
  background: rgba(46, 53, 56, 0.33);
  bottom: 0;
  display: flex;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  align-items: center;
  z-index: 52;
  > [data-reach-dialog-content] {
    ${(p) => p.width && 'box-sizing: border-box;'}
    flex-basis: ${(p) => !p.width && '100%'};
    width: ${(p) => !p.width && '100%'};
    border: ${(p) => border(p.theme, '')};
    ${(p) => shapeMap[p.theme.shape]};
    background: white;
    ${(p): string => boxShadow(p.theme, 2)};
    margin: auto;
    max-width: ${(p) => !p.width && '80%'};
    ${width}
    ${height}
    ${maxHeight}
    outline: none;
    padding: 64px 24px 40px 24px;
    position: relative;
    .modal-children {
      word-break: break-word;
    }
    ${variant({
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
    ${IconButton} {
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
      ${IconButton} {
        height: 24px;
        position: absolute;
        right: 40px;
        top: 40px;
        width: 24px;
      }
    }
  }
`
export const Modal = styled(Modalbase)``

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
}
export default Modal
