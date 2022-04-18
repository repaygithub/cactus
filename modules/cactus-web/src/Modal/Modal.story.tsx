import { Page } from 'puppeteer'
import React, { useState } from 'react'

import { Alert, Button, ColorPicker, DateInputField, Modal, SelectField, Text, Tooltip } from '../'
import { Action, actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'
import { modalType } from './Modal'

export default {
  title: 'Modal',
  component: Modal,
  argTypes: {
    className: HIDE_CONTROL,
    isOpen: HIDE_CONTROL,
    variant: { options: modalType },
    modalLabel: STRING,
    ...actions('onClose'),
  },
} as const

type CloseArg = { onClose: Action<React.MouseEvent | void> }
interface BasicArgs extends CloseArg {
  contents: string
  styleProps: React.ComponentProps<typeof Modal>
}

export const BasicUsage: Story<typeof Modal, BasicArgs> = ({
  contents,
  onClose,
  styleProps,
  ...args
}) => {
  const [open, setOpen] = useState(true)
  return open ? (
    <Modal {...styleProps} {...args} isOpen={open} onClose={onClose.wrap(() => setOpen(false))}>
      <Text as="h3">{contents}</Text>
    </Modal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}
BasicUsage.args = { contents: 'This is a Modal', styleProps: {} }

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
      <SelectField
        name="select"
        label="Pick an Option"
        options={['a', 'b', 'c']}
        tooltip="Select only one!"
        autoTooltip={false}
      />
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
