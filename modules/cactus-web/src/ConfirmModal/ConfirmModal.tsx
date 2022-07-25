import icons from '@repay/cactus-icons'
import { ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import cssVariant from '../helpers/variant'
import Modal, { ModalProps } from '../Modal/Modal'
import Text from '../Text/Text'
import TextButton from '../TextButton/TextButton'

export type IconSizes = 'medium' | 'large'
export type IconNames = keyof typeof icons
const iconNames: IconNames[] = Object.keys(icons) as (keyof typeof icons)[]

interface ConfirmModalProps extends Omit<ModalProps, 'title'> {
  cancelButtonText?: React.ReactNode
  confirmButtonText?: React.ReactNode
  onConfirm: () => void
  title?: React.ReactNode
  iconName?: IconNames
  iconSize?: IconSizes
}

interface IconProps {
  iconSize?: IconSizes
  iconName?: IconNames
  className?: string
  variant?: ModalProps['variant']
}

const IconBase = ({ className, iconSize, iconName }: IconProps): React.ReactElement => {
  const IconComponent = iconName && (icons[iconName] as React.ComponentType<any>)

  return <div className={className}>{IconComponent && <IconComponent iconSize={iconSize} />}</div>
}

const getIconWidthAndHeight = ({ iconSize }: IconProps): '56px' | '88px' | undefined => {
  switch (iconSize) {
    case 'medium':
      return '56px'
    case 'large':
      return '88px'
  }
}

const getFlexDirection = ({ iconSize }: ConfirmModalProps): 'row' | 'column' =>
  iconSize === 'medium' ? 'row' : 'column'

const ConfirmModalBase: React.FC<ConfirmModalProps> = ({
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
    <Modal variant={variant} onClose={onClose} flexFlow {...props}>
      <Flex alignItems="center" className="title-icon">
        {iconName && (
          <Icon iconSize={iconSize} iconName={iconName} variant={variant} className="icon" />
        )}
        <Text as="h1">{title}</Text>
      </Flex>
      <Flex className="children" flexDirection="column" justifyContent="center" alignItems="center">
        {children}
      </Flex>
      <Flex justifyContent="space-between" marginTop={7} marginBottom={2}>
        <TextButton mr={5} onClick={onClose}>
          {cancelButtonText}
        </TextButton>
        <Button onClick={onConfirm} variant={variant}>
          {confirmButtonText}
        </Button>
      </Flex>
    </Modal>
  )
}

export const ConfirmModal = styled(ConfirmModalBase)`
  .title-icon {
    flex-direction: column;
    ${(p): string => p.theme.mediaQueries.medium} {
      flex-direction: ${getFlexDirection};
    }
    text-align: center;
    margin: ${(p): string => (p.iconName && p.iconSize === 'medium' ? '0 0 24px 0' : '0')};
    > h1 {
      margin-left: ${(p): string | undefined =>
        p.iconName && p.iconSize === 'medium' ? '8px' : undefined};
      margin-top: ${(p): string | undefined =>
        p.iconName && p.iconSize === 'large' ? '24px' : undefined};
    }
  }
  .children {
    overflow-wrap: break-word;
    word-wrap: break-word;
    text-align: center;
    width: 100%;
    > * {
      width: 100%;
    }
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
  ${cssVariant({
    action: css`
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    `,
    warning: css`
      ${(p): ColorStyle => p.theme.colorStyles.warning};
    `,
    success: css`
      ${(p): ColorStyle => p.theme.colorStyles.success};
    `,
    danger: css`
      ${(p): ColorStyle => p.theme.colorStyles.error};
    `,
  })}
`
ConfirmModal.propTypes = {
  ...Modal.propTypes,
  cancelButtonText: PropTypes.node,
  confirmButtonText: PropTypes.node,
  iconName: PropTypes.oneOf([...iconNames]),
  iconSize: PropTypes.oneOf(['medium', 'large']),
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.node,
}

ConfirmModal.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Confirm',
  iconSize: 'medium',
  title: 'Modal Title',
}
export default ConfirmModal
