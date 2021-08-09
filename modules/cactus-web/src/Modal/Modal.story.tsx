import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { Alert, Button, ColorPicker, DateInputField, Modal, SelectField, Text } from '../'
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
      onClose={() => setOpen(false)}
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
      onClose={() => setOpen(false)}
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

const ModalWithPopups = () => {
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
      width={text('width', '')}
      innerHeight={text('innerHeight', '')}
      innerMaxHeight={text('innerMaxHeight', '')}
    >
      <ColorPicker name="color" id="color" />
      <DateInputField name="date" label="Pick a Date" />
      <SelectField name="select" label="Pick an Option" options={['a', 'b', 'c']} />
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

export const BasicUsage = (): React.ReactElement => <ModalWithState />
export const WithAlert = (): React.ReactElement => <ModalWithAlert />
export const WithPopups = (): React.ReactElement => <ModalWithPopups />
WithPopups.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('[aria-label="Open date picker"]')
  },
}
