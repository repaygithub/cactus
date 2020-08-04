import * as icons from '@repay/cactus-icons'
import { CactusTheme, ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, ThemeProps } from 'styled-components'

import Button from '../Button/Button'
import Flex from '../Flex/Flex'
import variant from '../helpers/variant'
import Modal, { ModalProps } from '../Modal/Modal'
import Text from '../Text/Text'
import TextButton from '../TextButton/TextButton'

export type IconSizes = 'medium' | 'large'
export type IconNames = keyof typeof icons
const iconNames: IconNames[] = Object.keys(icons) as (keyof typeof icons)[]

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

const IconBase = ({ className, iconSize, iconName }: IconProps): React.ReactElement => {
  const Icon = iconName && (icons[iconName] as React.ComponentType<any>)

  return <div className={className}>{Icon && <Icon iconSize={iconSize} />}</div>
}

const getIconWidthAndHeight = ({ iconSize }: IconProps): '56px' | '88px' | undefined => {
  switch (iconSize) {
    case 'medium':
      return '56px'
    case 'large':
      return '88px'
  }
}

const getFlexDirection = ({
  iconSize,
}: ConfirmModalProps & ThemeProps<CactusTheme>): 'row' | 'column' =>
  iconSize === 'medium' ? 'row' : 'column'

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
}): React.ReactElement => {
  return (
    <Modal variant={variant} onClose={onClose} {...props}>
      <Flex alignItems="center" className="title-icon">
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
    flex-direction: column;
    ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
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
  ${variant({
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
  cancelButtonText: PropTypes.string,
  className: PropTypes.string,
  closeLabel: PropTypes.string,
  confirmButtonText: PropTypes.string,
  description: PropTypes.string,
  iconName: PropTypes.oneOf([...iconNames]),
  iconSize: PropTypes.oneOf(['medium', 'large']),
  isOpen: PropTypes.bool.isRequired,
  modalLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['action', 'danger', 'warning', 'success']),
}

ConfirmModal.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Confirm',
  description: undefined,
  iconName: undefined,
  iconSize: 'medium',
  title: 'Modal Title',
}
export default ConfirmModal
