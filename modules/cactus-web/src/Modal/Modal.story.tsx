import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Button from '../Button/Button'
import Modal, { ModalType } from './Modal'
import React, { useState } from 'react'
import Text from '../Text/Text'

const modalStories = storiesOf('Modal', module)

type StatusOptions = { [k in ModalType]: ModalType }

const statusOptions: StatusOptions = {
  action: 'action',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
}

const ModalWithState = () => {
  const [open, setOpen] = useState(true)
  const variant = select('variant', statusOptions, statusOptions.action)
  const modalLabel = text('Modal Label', 'Modal Label')
  const closeLabel = text('Close icon label', 'Close Label')

  return open ? (
    <Modal
      variant={variant}
      isOpen={open}
      onClose={() => setOpen(false)}
      modalLabel={modalLabel}
      closeLabel={closeLabel}
    >
      <Text as="h3">This is a Modal</Text>
    </Modal>
  ) : (
    <Button variant="action" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  )
}
modalStories.add('Basic Usage', () => <ModalWithState />)
