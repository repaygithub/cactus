import * as icons from '@repay/cactus-icons'
import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { useState } from 'react'

import { Button, ConfirmModal, Text, TextInput } from '../'
import { ModalType } from '../Modal/Modal'

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]

type StatusOptions = { [k in ModalType]: ModalType }
const statusOptions: StatusOptions = {
  action: 'action',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
}

export default {
  title: 'ConfirmModal',
  component: ConfirmModal,
} as Meta

const ConfirmModalExample = (): React.ReactElement => {
  const [isOpen, setOpen] = useState(true)
  const cancelText = text('Cancel Button Text', 'Cancel')
  const confirmText = text('Confirm Button Text', 'Confirm')
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const iconSize = select('Icon size', ['medium', 'large'], 'medium')
  const variant = select('variant', statusOptions, statusOptions.action)
  const descriptionText = text(
    'Description text',
    'Your actions can override past setting causing unintended consequences.'
  )

  return isOpen ? (
    <ConfirmModal
      isOpen={isOpen}
      onClose={(): void => setOpen(false)}
      variant={variant}
      onConfirm={(): void => setOpen(false)}
      confirmButtonText={confirmText}
      cancelButtonText={cancelText}
      iconName={iconName}
      iconSize={iconSize}
      title={text('Title', '')}
    >
      <Text as="h4" fontWeight="normal">
        {descriptionText}
      </Text>
    </ConfirmModal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

const ConfirmModalExample2 = (): React.ReactElement => {
  const [isOpen, setOpen] = useState(true)
  const cancelText = text('Cancel Button Text', 'Cancel')
  const confirmText = text('Confirm Button Text', 'Confirm')
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const iconSize = select('Icon size', ['medium', 'large'], 'medium')
  const variant = select('variant', statusOptions, statusOptions.action)
  const descriptionText = text(
    'Description text',
    'Your actions can override past setting causing unintended consequences.'
  )

  return isOpen ? (
    <ConfirmModal
      isOpen={isOpen}
      onClose={(): void => setOpen(false)}
      variant={variant}
      onConfirm={(): void => setOpen(false)}
      confirmButtonText={confirmText}
      cancelButtonText={cancelText}
      iconName={iconName}
      iconSize={iconSize}
    >
      <Text as="h4" fontWeight="normal" margin="0 0 16px 0">
        {descriptionText}
      </Text>
      <TextInput placeholder="Placeholder" width="60%" />
    </ConfirmModal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

export const BasicUsage = (): React.ReactElement => <ConfirmModalExample />
export const WithTextInputIcon = (): React.ReactElement => <ConfirmModalExample2 />

WithTextInputIcon.storyName = 'With text input icon'
