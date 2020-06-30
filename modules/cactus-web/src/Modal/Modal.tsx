import { BorderSize, CactusTheme, Shape } from '@repay/cactus-theme'
import { DialogContent, DialogOverlay, DialogProps } from '@reach/dialog'
import { NavigationClose } from '@repay/cactus-icons'
import Flex from '../Flex/Flex'
import IconButton from '../IconButton/IconButton'
import PropTypes from 'prop-types'
import React, { FunctionComponent } from 'react'
import styled, { css, ThemeProps } from 'styled-components'

export type ModalType = 'default' | 'danger' | 'warning' | 'success'

interface ModalProps {
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

const baseColor = ({ variant, theme }: ModalPopupProps & ThemeProps<CactusTheme>) => {
  switch (variant) {
    case 'default':
      return theme.colors.callToAction
    case 'danger':
      return theme.colors.error
    case 'success':
      return theme.colors.success
    case 'warning':
      return theme.colors.warning
  }
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
const getShape = (shape: Shape) => shapeMap[shape]

const getBorder = (size: BorderSize) => borderMap[size]

const Modalbase: FunctionComponent<ModalProps> = (props) => {
  const { variant = 'default', children, isOpen, onClose, modalLabel, closeLabel, ...rest } = props
  const hasChildren = !!React.Children.count(children)

  return (
    <ModalPopUp
      aria-label={modalLabel}
      isOpen={isOpen}
      onDismiss={onClose}
      variant={variant}
      {...rest}
    >
      <DialogContent aria-label={`${modalLabel}-content`}>
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
  z-index: 52;
  > [data-reach-dialog-content] {
    ${(p) => getBorder(p.theme.border)};
    ${(p) => getShape(p.theme.shape)};
    background: white;
    border-color: ${baseColor};
    box-shadow: ${(p) => p.theme.boxShadows && '0px 9px 24px rgba(3, 118, 176, 0.348704)'};
    margin: auto;
    max-width: 90%;
    outline: none;
    padding: 64px 24px 40px 24px;
    position: relative;
    ${IconButton} {
      height: 16px;
      position: absolute;
      right: 24px;
      top: 24px;
      width: 16px;
    }
    ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
      padding: 40px 88px;
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
  variant: PropTypes.oneOf(['default', 'danger', 'warning', 'success']),
}

Modal.defaultProps = {
  closeLabel: 'Close Label',
  isOpen: false,
  modalLabel: 'Modal Label',
  variant: 'default',
}
export default Modal
