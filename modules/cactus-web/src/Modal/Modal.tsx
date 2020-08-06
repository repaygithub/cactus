import { DialogContent, DialogOverlay, DialogProps } from '@reach/dialog'
import { NavigationClose } from '@repay/cactus-icons'
import { BorderSize, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { FunctionComponent } from 'react'
import styled, { css, FlattenSimpleInterpolation } from 'styled-components'

import Flex from '../Flex/Flex'
import { boxShadow } from '../helpers/theme'
import variant from '../helpers/variant'
import IconButton from '../IconButton/IconButton'

export type ModalType = 'action' | 'danger' | 'warning' | 'success'

export interface ModalProps {
  className?: string
  closeLabel?: string
  isOpen: boolean
  modalLabel?: string
  onClose: () => void
  variant?: ModalType
}
interface ModalPopupProps extends DialogProps {
  variant: ModalType
}

const borderMap = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const shapeMap = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 8px;
  `,
  round: css`
    border-radius: 20px;
  `,
}
const getShape = (shape: Shape): FlattenSimpleInterpolation => shapeMap[shape]

const getBorder = (size: BorderSize): FlattenSimpleInterpolation => borderMap[size]

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
          <Flex flexDirection="column" alignItems="center">
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
    flex-basis: 100%;
    width: 100%;
    ${(p): FlattenSimpleInterpolation => getBorder(p.theme.border)};
    ${(p): FlattenSimpleInterpolation => getShape(p.theme.shape)};
    background: white;
    ${(p): string => boxShadow(p.theme, 2)};
    margin: auto;
    max-width: 80%;
    outline: none;
    padding: 64px 24px 40px 24px;
    position: relative;
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
    }
    ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
      padding: 40px 88px;
      max-width: 30%;
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
