import * as icons from '@repay/cactus-icons/i'
import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import Button from '../Button/Button'
import { ModalType } from '../Modal/Modal'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'
import ConfirmModal from './ConfirmModal'

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
const ConfirmModalExample = (): React.ReactElement => {
  const [isOpen, setOpen] = useState(false)
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
  const [isOpen, setOpen] = useState(false)
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

confirmModalStories.add('Basic Usage', (): React.ReactElement => <ConfirmModalExample />)
confirmModalStories.add('With text input icon', (): React.ReactElement => <ConfirmModalExample2 />)
