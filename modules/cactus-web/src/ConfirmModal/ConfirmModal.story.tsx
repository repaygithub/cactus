import * as icons from '@repay/cactus-icons/i'
import { ModalType } from '../Modal/Modal'
import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Button from '../Button/Button'
import ConfirmModal from './ConfirmModal'
import React, { useState } from 'react'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'

const confirmModalStories = storiesOf('ConfirmModal', module)
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]

type StatusOptions = { [k in ModalType]: ModalType }
const statusOptions: StatusOptions = {
  action: 'action',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
}
const ConfirmModalExample = () => {
  const [isOpen, setOpen] = useState(false)
  const cancelText = text('Cancel Button Text', 'Cancel')
  const confirmText = text('Confirm Button Text', 'Confirm')
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const iconSize = select('Icon size', ['medium', 'large'], 'medium')
  const variant = select('variant', statusOptions, statusOptions.action)
  const descrpitionText = text(
    'Description text',
    'Your actions can override past setting causing unintended consecuences.'
  )

  return isOpen ? (
    <ConfirmModal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      variant={variant}
      onConfirm={() => setOpen(false)}
      confirmButtonText={confirmText}
      cancelButtonText={cancelText}
      iconName={iconName}
      iconSize={iconSize}
    >
      <Text as="h4" fontWeight="normal">
        {descrpitionText}
      </Text>
    </ConfirmModal>
  ) : (
    <Button variant="action" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  )
}

const ConfirmModalExample2 = () => {
  const [isOpen, setOpen] = useState(false)
  const cancelText = text('Cancel Button Text', 'Cancel')
  const confirmText = text('Confirm Button Text', 'Confirm')
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const iconSize = select('Icon size', ['medium', 'large'], 'medium')
  const variant = select('variant', statusOptions, statusOptions.action)
  const descrpitionText = text(
    'Description text',
    'Your actions can override past setting causing unintended consecuences.'
  )

  return isOpen ? (
    <ConfirmModal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      variant={variant}
      onConfirm={() => setOpen(false)}
      confirmButtonText={confirmText}
      cancelButtonText={cancelText}
      iconName={iconName}
      iconSize={iconSize}
    >
      <Text as="h4" fontWeight="normal" margin="0 0 16px 0">
        {descrpitionText}
      </Text>
      <TextInput placeholder="Placeholder" width="90%" />
    </ConfirmModal>
  ) : (
    <Button variant="action" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  )
}

confirmModalStories.add('Basic Usage', () => <ConfirmModalExample />)
confirmModalStories.add('With text input icon', () => <ConfirmModalExample2 />)
