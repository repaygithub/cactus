import * as icons from '@repay/cactus-icons'
import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import Modal, { ModalProps } from '../Modal/Modal'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'
import Text from '../Text/Text'
import TextButton from '../TextButton/TextButton'
import variant from '../helpers/variant'

export type IconSizes = 'medium' | 'large'
export type IconNames = keyof typeof icons
const iconNames: IconNames[] = Object.keys(icons) as Array<keyof typeof icons>

interface ConfirmModalProps extends ModalProps {
  cancelButtonText?: string
  children?: React.ReactNode
  confirmButtonText?: string
  description?: string
  onConfirm: () => void
  title?: string
  iconName?: IconNames
  iconSize?: IconSizes
}

interface IconProps {
  iconSize?: IconSizes
  iconName?: IconNames
  className?: string
  variant?: string
}

const IconBase = ({ className, iconSize, iconName }: IconProps) => {
  const Icon = iconName && (icons[iconName] as React.ComponentType<any>)

  return <div className={className}>{Icon && <Icon iconSize={iconSize} />}</div>
}

const getIconWidthAndHeight = ({ iconSize }: IconProps) => {
  switch (iconSize) {
    case 'medium':
      return '56px'
    case 'large':
      return '88px'
  }
}

const ConfirmModalBase: React.FunctionComponent<ConfirmModalProps> = ({
  cancelButtonText,
  children,
  confirmButtonText,
  onClose,
  onConfirm,
  iconSize,
  iconName,
  variant,
  title,
  ...props
}) => {
  return (
    <Modal variant={variant} onClose={onClose} {...props}>
      <Flex
        flexDirection={iconSize === 'medium' ? 'row' : 'column'}
        alignItems="center"
        className="title-icon"
      >
        {iconName && (
          <Icon iconSize={iconSize} iconName={iconName} variant={variant} className="icon" />
        )}
        <Text as="h1" margin="0">
          {title}
        </Text>
      </Flex>
      <Flex className="children" flexDirection="column" justifyContent="center" alignItems="center">
        {children}
      </Flex>
      <Flex justifyContent="space-between" marginTop="40px">
        <Button onClick={onConfirm} variant={variant} marginRight="24px">
          {confirmButtonText}
        </Button>
        <TextButton onClick={onClose}>{cancelButtonText}</TextButton>
      </Flex>
    </Modal>
  )
}

export const ConfirmModal = styled(ConfirmModalBase)`
  .title-icon {
    text-align: center;
    margin: ${(p) => (p.iconName && p.iconSize === 'medium' ? '0 0 24px 0' : 0)};
    > h1 {
      margin-left: ${(p) => p.iconName && p.iconSize === 'medium' && '8px'};
      margin-top: ${(p) => p.iconName && p.iconSize === 'large' && '24px'};
    }
  }
  .children {
    text-align: center;
    width: 100%;
  }
`

const Icon = styled(IconBase)<IconProps>`
  box-sizing: border-box;
  width: ${getIconWidthAndHeight};
  height: ${getIconWidthAndHeight};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  ${variant({
    action: css`
      background-color: ${(p) => p.theme.colors.callToAction};
    `,
    warning: css`
      background-color: ${(p) => p.theme.colors.warning};
    `,
    success: css`
      background-color: ${(p) => p.theme.colors.success};
    `,
    danger: css`
      background-color: ${(p) => p.theme.colors.error};
    `,
  })}
`
ConfirmModal.propTypes = {
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  description: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  iconSize: PropTypes.oneOf(['medium', 'large']),
  iconName: PropTypes.oneOf([...iconNames]),
}

ConfirmModal.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Confirm',
  description: undefined,
  title: 'Modal Title',
  iconName: undefined,
  iconSize: 'medium',
}
export default ConfirmModal
