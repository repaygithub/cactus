import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { Alert, Button, ColorPicker, DateInputField, Modal, SelectField, Text } from '../'
import { Action, actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'Modal',
  component: Modal,
  argTypes: {
    className: HIDE_CONTROL,
    isOpen: HIDE_CONTROL,
    variant: { options: ['action', 'danger', 'warning', 'success'] },
    closeLabel: STRING,
    modalLabel: STRING,
    width: STRING,
    innerHeight: STRING,
    innerMaxHeight: STRING,
    ...actions('onClose'),
  },
} as const

type CloseArg = { onClose: Action<React.MouseEvent | void> }

export const BasicUsage: Story<typeof Modal, CloseArg & { contents: string }> = ({
  contents,
  onClose,
  ...args
}) => {
  const [open, setOpen] = useState(true)
  return open ? (
    <Modal {...args} isOpen={open} onClose={onClose.wrap(() => setOpen(false))}>
      <Text as="h3">{contents}</Text>
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}
BasicUsage.args = { contents: 'This is a Modal' }

export const WithAlert: Story<typeof Modal, CloseArg> = ({ onClose, ...args }) => {
  const [open, setOpen] = useState(true)

  return open ? (
    <Modal {...args} isOpen={open} onClose={onClose.wrap(() => setOpen(false))}>
      <Alert status="success" onClose={onClose}>
        An alert inside the modal.
      </Alert>
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

export const WithPopups: Story<typeof Modal, CloseArg> = ({ onClose, ...args }) => {
  const [open, setOpen] = useState(true)
  return open ? (
    <Modal {...args} isOpen={open} onClose={onClose.wrap(() => setOpen(false))}>
      <ColorPicker name="color" id="color" />
      <DateInputField name="date" label="Pick a Date" defaultValue="2021-08-17" />
      <SelectField name="select" label="Pick an Option" options={['a', 'b', 'c']} />
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}

WithPopups.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('[aria-label="Open date picker"]')
  },
}
