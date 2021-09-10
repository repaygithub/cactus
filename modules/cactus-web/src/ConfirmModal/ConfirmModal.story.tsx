import React, { useState } from 'react'

import { Button, ConfirmModal, Text, TextInput } from '../'
import { Action, actions, HIDE_CONTROL, ICON_ARG, Story, STRING } from '../helpers/storybook'

export default {
  title: 'ConfirmModal',
  component: ConfirmModal,
  argTypes: {
    title: STRING,
    confirmButtonText: STRING,
    cancelButtonText: STRING,
    iconName: { ...ICON_ARG, mapping: undefined },
    closeLabel: STRING,
    modalLabel: STRING,
    className: HIDE_CONTROL,
    isOpen: HIDE_CONTROL,
    ...actions('onConfirm', 'onClose'),
  },
  args: {
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Confirm',
    variant: 'action',
    description: 'Your actions can override past setting causing unintended consequences.',
  },
} as const

interface Args {
  description: string
  onConfirm: Action<void>
  onClose: Action<void>
}

export const BasicUsage: Story<typeof ConfirmModal, Args> = ({
  description,
  onConfirm,
  onClose,
  ...args
}) => {
  const [isOpen, setOpen] = useState(true)
  return isOpen ? (
    <ConfirmModal
      {...args}
      isOpen={isOpen}
      onClose={onClose.wrap(() => setOpen(false))}
      onConfirm={onConfirm.wrap(() => setOpen(false))}
    >
      <Text as="h4" fontWeight="normal">
        {description}
      </Text>
    </ConfirmModal>
  ) : (
    <Button variant="action" onClick={(): void => setOpen(true)}>
      Open Modal
    </Button>
  )
}
// A little weird but needed to match how the knobs behaved.
BasicUsage.argTypes = { title: { mapping: null } }

export const WithTextInputIcon: Story<typeof ConfirmModal, Args> = ({
  description,
  onConfirm,
  onClose,
  ...args
}) => {
  const [isOpen, setOpen] = useState(true)
  return isOpen ? (
    <ConfirmModal
      {...args}
      isOpen={isOpen}
      onClose={onClose.wrap(() => setOpen(false))}
      onConfirm={onConfirm.wrap(() => setOpen(false))}
    >
      <Text as="h4" fontWeight="normal" margin="0 0 16px 0">
        {description}
      </Text>
      <TextInput placeholder="Placeholder" width="60%" />
    </ConfirmModal>
  ) : (
    <Button variant="action" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  )
}
WithTextInputIcon.storyName = 'With text input icon'
