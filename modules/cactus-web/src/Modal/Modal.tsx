import React, { FunctionComponent } from 'react'

import { CactusTheme } from '@repay/cactus-theme'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { NavigationClose } from '@repay/cactus-icons'
import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import IconButton from '../IconButton/IconButton'
import PropTypes from 'prop-types'
import styled, { ThemeProps } from 'styled-components'
import Text from '../Text/Text'
import TextButton from '../TextButton/TextButton'

export type ModalType = 'action' | 'danger'
export type IconProps = { iconSize: 'tiny' | 'small' | 'medium' | 'large' }

interface IconComponentProps {
  icon: React.FunctionComponent<IconProps>
}
interface ModalProps {
  buttonText?: string
  className?: string
  closeLabel?: string
  closeModal?: () => void
  description?: string
  height?: string
  isOpen?: boolean
  modalLabel?: string
  modalTitle?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: ModalType
  width?: string
}

const baseColor = (props: ModalProps & ThemeProps<CactusTheme>) => {
  const { variant } = props
  switch (variant) {
    case 'action':
      return props.theme.colors.callToAction
    case 'danger':
      return props.theme.colors.error
  }
}

const IconBase = (props: IconComponentProps & ModalProps) => {
  const { className, icon: Icon } = props

  return (
    <div className={className}>
      <Icon iconSize="medium" />
    </div>
  )
}

const Modalbase: FunctionComponent<ModalProps & IconComponentProps> = props => {
  const {
    variant,
    modalTitle,
    description,
    buttonText,
    onClick,
    children,
    isOpen,
    closeModal,
    modalLabel,
    closeLabel,
    icon,
    ...rest
  } = props

  return (
    <ModalPopUp
      aria-label={modalLabel}
      isOpen={isOpen}
      onDismiss={closeModal}
      variant={variant}
      {...rest}
    >
      <DialogContent aria-label={`${modalLabel}-content`}>
        <IconButton iconSize="small" onClick={closeModal} label={closeLabel}>
          <NavigationClose />
        </IconButton>
        <Flex flexDirection="column" alignItems="center" height="100%">
          <Icon variant={variant} icon={icon} />
          <Text as="h1" marginBottom="0">
            {modalTitle}
          </Text>
          <Text as="h3" fontWeight="normal" margin="0">
            {description}
          </Text>
          <div className="children">{variant === 'action' && children}</div>
          <Flex justifyContent="center" width="90%" marginTop="auto">
            <Button variant={variant} onClick={onClick} marginRight="16px">
              {buttonText}
            </Button>
            <TextButton onClick={closeModal}>Cancel</TextButton>
          </Flex>
        </Flex>
      </DialogContent>
    </ModalPopUp>
  )
}

export const ModalPopUp = styled(DialogOverlay)<ModalProps>`
  background: hsla(0, 0%, 0%, 0.33);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  z-index: 52;
  > h1 {
    margin-block-end: 0;
  }
  & div.children {
    margin-top: 16px;
    width: 100%;
    > div {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
  > [data-reach-dialog-content] {
    margin: 10vh auto;
    background: white;
    outline: none;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0px 9px 24px rgba(3, 118, 176, 0.348704);
    position: relative;
    border: 1px solid ${baseColor};
    display: block;
    min-width: 30%;
    min-height: 40%;
    width: ${p => p.width};
    height: ${p => p.height};
  }
  ${IconButton} {
    position: absolute;
    right: 40px;
    top: 40px;
  }
  ${Button} {
    min-width: 166px;
  }
`

const Icon = styled(IconBase)`
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: ${baseColor};
`

export const Modal = styled(Modalbase)``

Modal.propTypes = {
  buttonText: PropTypes.string,
  className: PropTypes.string,
  closeLabel: PropTypes.string,
  closeModal: PropTypes.func,
  description: PropTypes.string,
  height: PropTypes.string,
  isOpen: PropTypes.bool,
  modalLabel: PropTypes.string,
  onClick: PropTypes.func,
  modalTitle: PropTypes.string,
  variant: PropTypes.oneOf(['action', 'danger']),
  width: PropTypes.string,
}

Modal.defaultProps = {
  variant: 'action',
  modalTitle: 'Modal Title',
  description: 'Modal description',
  buttonText: 'Confirm',
  modalLabel: 'Modal Label',
  closeLabel: 'Close Label',
  width: '30%',
  height: '30%',
  isOpen: false,
}
export default Modal
