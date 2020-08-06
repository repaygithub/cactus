import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import Button from '../Button/Button'
import Text from '../Text/Text'
import Modal, { ModalType } from './Modal'

const modalStories = storiesOf('Modal', module)

type StatusOptions = { [k in ModalType]: ModalType }

const statusOptions: StatusOptions = {
  action: 'action',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
}

const ModalWithState = (): React.ReactElement => {
  const [open, setOpen] = useState(true)
  const variant = select('variant', statusOptions, statusOptions.action)
  const modalLabel = text('Modal Label', 'Modal Label')
  const closeLabel = text('Close icon label', 'Close Label')

  return open ? (
    <Modal
      variant={variant}
      isOpen={open}
      onClose={(): void => setOpen(false)}
      modalLabel={modalLabel}
      closeLabel={closeLabel}
    >
      <Text as="h3">This is a Modal</Text>
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}
modalStories.add('Basic Usage', (): React.ReactElement => <ModalWithState />)
