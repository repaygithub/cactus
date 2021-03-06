import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { useState } from 'react'

import { Alert, Button, Modal, Text } from '../'
import { ModalType } from './Modal'

export default {
  title: 'Modal',
  component: Modal,
} as Meta

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
      width={text('width', '')}
      innerHeight={text('innerHeight', '')}
      innerMaxHeight={text('innerMaxHeight', '')}
    >
      <Text as="h3">{text('modal content', 'This is a Modal')}</Text>
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

const ModalWithAlert = (): React.ReactElement => {
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
      width={text('width', '')}
      innerHeight={text('innerHeight', '')}
      innerMaxHeight={text('innerMaxHeight', '')}
    >
      <Alert status="success" onClose={() => console.log('CLOSE pressed')}>
        An alert inside the modal.
      </Alert>
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

export const BasicUsage = (): React.ReactElement => <ModalWithState />
export const WithAlert = (): React.ReactElement => <ModalWithAlert />
